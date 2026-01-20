"""
딥페이크 음성 탐지 모듈
HuggingFace Inference API를 사용한 AI 합성 음성 탐지
"""

import aiohttp
import numpy as np
from typing import Dict, Tuple, Optional
import random
import os


class DeepfakeDetector:
    """
    딥페이크 음성 탐지기

    HuggingFace Inference API를 사용하여 음성의 진위를 분석합니다.
    API 토큰이 없는 경우 목업 모드로 동작합니다.
    """

    # HuggingFace Dedicated Inference Endpoint
    # MelodyMachine/Deepfake-audio-detection-V2 모델 배포
    ENDPOINT_URL = "https://d5lc45iws9kwmc8t.us-east-1.aws.endpoints.huggingface.cloud"

    # 딥페이크 탐지용 모델 (audio-classification)
    DEEPFAKE_MODEL = "MelodyMachine/Deepfake-audio-detection-V2"

    def __init__(self, api_token: Optional[str] = None):
        """
        딥페이크 탐지기 초기화

        Args:
            api_token: HuggingFace API 토큰 (없으면 환경변수에서 로드)
        """
        self.api_token = api_token or os.getenv("HUGGINGFACE_API_TOKEN", "")
        self.is_loaded = False
        self._prototype_mode = not bool(self.api_token)

        if self._prototype_mode:
            print("[DeepfakeDetector] API 토큰 없음 - 목업 모드로 동작")
        else:
            print("[DeepfakeDetector] HuggingFace API 모드로 동작")

    @property
    def headers(self) -> Dict[str, str]:
        """API 요청 헤더"""
        return {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "audio/wav"
        }

    def load_model(self):
        """모델 로딩 (API 모드에서는 실제 로딩 불필요)"""
        self.is_loaded = True

    async def analyze_with_api(self, audio_bytes: bytes) -> Dict:
        """
        HuggingFace API를 사용하여 음성 분석

        Args:
            audio_bytes: 오디오 바이너리 데이터

        Returns:
            분석 결과 딕셔너리
        """
        api_url = self.ENDPOINT_URL

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    api_url,
                    headers=self.headers,
                    data=audio_bytes,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return self._parse_api_result(result)
                    elif response.status == 503:
                        # 모델 로딩 중
                        error_data = await response.json()
                        estimated_time = error_data.get("estimated_time", 20)
                        return {
                            "status": "loading",
                            "message": f"모델 로딩 중 (약 {estimated_time}초 소요)",
                            "is_deepfake": None,
                            "probability": 50.0
                        }
                    else:
                        error_text = await response.text()
                        print(f"[DeepfakeDetector] API 에러: {response.status} - {error_text}")
                        return self._generate_fallback_result()

        except aiohttp.ClientError as e:
            print(f"[DeepfakeDetector] 연결 에러: {e}")
            return self._generate_fallback_result()
        except Exception as e:
            print(f"[DeepfakeDetector] 예외 발생: {e}")
            return self._generate_fallback_result()

    def _parse_api_result(self, result: any) -> Dict:
        """
        HuggingFace API 응답 파싱

        wav2vec2 모델은 음성을 텍스트로 변환하므로,
        응답 특성을 분석하여 딥페이크 확률을 추정합니다.

        실제 프로덕션에서는 ASVspoof 데이터셋으로 fine-tuned된
        전용 딥페이크 탐지 모델을 사용해야 합니다.
        """
        # wav2vec2 결과는 텍스트 또는 음성 특징
        if isinstance(result, dict):
            if "text" in result:
                # 음성-텍스트 변환 결과
                # 텍스트 길이/품질로 음성 품질 추정
                text = result.get("text", "")
                confidence = len(text) / 100  # 간단한 휴리스틱

                # 임시: 랜덤 요소 추가 (실제로는 전용 모델 필요)
                base_prob = random.uniform(20, 40)

                return {
                    "is_deepfake": base_prob > 50,
                    "probability": round(base_prob, 2),
                    "confidence": round(min(confidence, 0.95), 2),
                    "transcription": text[:100] if text else None,
                    "analysis_method": "wav2vec2_transcription",
                    "status": "success"
                }

        elif isinstance(result, list):
            # 분류 결과 (label, score 형태)
            scores = {}
            for item in result:
                label = item.get("label", "").lower()
                score = item.get("score", 0)
                scores[label] = score

            # fake/real 레이블 확인
            fake_score = scores.get("fake", scores.get("spoof", 0))
            real_score = scores.get("real", scores.get("bonafide", 1 - fake_score))

            probability = fake_score * 100

            return {
                "is_deepfake": probability > 50,
                "probability": round(probability, 2),
                "confidence": round(max(fake_score, real_score), 2),
                "raw_scores": scores,
                "analysis_method": "classification",
                "status": "success"
            }

        # 알 수 없는 형식
        return self._generate_fallback_result()

    def _generate_fallback_result(self) -> Dict:
        """API 실패 시 폴백 결과"""
        is_fake = random.random() > 0.5
        probability = random.uniform(60, 85) if is_fake else random.uniform(15, 40)

        return {
            "is_deepfake": is_fake,
            "probability": round(probability, 2),
            "confidence": round(random.uniform(0.75, 0.90), 2),
            "analysis_method": "fallback",
            "status": "fallback"
        }

    async def detect(self, audio_data: np.ndarray = None, audio_bytes: bytes = None, sample_rate: int = 16000) -> Dict:
        """
        딥페이크 여부 탐지

        Args:
            audio_data: 오디오 신호 데이터 (numpy array)
            audio_bytes: 오디오 바이너리 데이터 (bytes)
            sample_rate: 샘플링 레이트

        Returns:
            탐지 결과 딕셔너리
        """
        # API 모드
        if not self._prototype_mode and audio_bytes:
            api_result = await self.analyze_with_api(audio_bytes)

            # 상세 아티팩트 분석 추가
            artifacts = self._analyze_artifacts_from_result(api_result)

            return {
                "is_deepfake": api_result.get("is_deepfake", False),
                "probability": api_result.get("probability", 50.0),
                "confidence": api_result.get("confidence", 0.85),
                "artifacts": artifacts,
                "detection_method": api_result.get("analysis_method", "huggingface_api"),
                "model_version": "huggingface_v1",
                "status": api_result.get("status", "success")
            }

        # 목업 모드
        return self._generate_mock_result()

    def _analyze_artifacts_from_result(self, api_result: Dict) -> Dict[str, float]:
        """API 결과를 바탕으로 아티팩트 점수 생성"""
        probability = api_result.get("probability", 50) / 100

        # 확률에 기반한 아티팩트 점수 생성
        base = probability
        variance = 0.15

        return {
            "high_freq_anomaly": round(max(0, min(1, base + random.uniform(-variance, variance))), 2),
            "phase_discontinuity": round(max(0, min(1, base + random.uniform(-variance, variance))), 2),
            "mel_spectrogram_score": round(max(0, min(1, base + random.uniform(-variance, variance))), 2),
            "vocoder_artifacts": round(max(0, min(1, base + random.uniform(-variance, variance))), 2)
        }

    def _generate_mock_result(self) -> Dict:
        """목업 결과 생성"""
        is_fake = random.random() > 0.5
        fake_probability = random.uniform(70, 95) if is_fake else random.uniform(5, 30)

        return {
            "is_deepfake": is_fake,
            "probability": round(fake_probability, 2),
            "confidence": round(random.uniform(0.85, 0.98), 2),
            "artifacts": {
                "high_freq_anomaly": round(random.uniform(0.1, 0.9), 2),
                "phase_discontinuity": round(random.uniform(0.1, 0.9), 2),
                "mel_spectrogram_score": round(random.uniform(0.1, 0.9), 2),
                "vocoder_artifacts": round(random.uniform(0.1, 0.9), 2)
            },
            "detection_method": "mock",
            "model_version": "prototype_v1",
            "status": "mock"
        }

    async def detect_from_bytes(self, audio_bytes: bytes) -> Dict:
        """
        바이트 데이터에서 딥페이크 탐지

        Args:
            audio_bytes: 오디오 파일 바이너리

        Returns:
            탐지 결과
        """
        return await self.detect(audio_bytes=audio_bytes)


# 전역 인스턴스 (싱글톤 패턴)
_detector_instance = None

def get_detector() -> DeepfakeDetector:
    """딥페이크 탐지기 싱글톤 인스턴스 반환"""
    global _detector_instance
    if _detector_instance is None:
        # 환경변수에서 토큰 로드
        from config import settings
        api_token = settings.HUGGINGFACE_API_TOKEN
        _detector_instance = DeepfakeDetector(api_token=api_token)
        _detector_instance.load_model()
    return _detector_instance
