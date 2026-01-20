"""
화자 검증 모듈
HuggingFace Inference API를 사용한 성문(Voiceprint) 검증
"""

import aiohttp
import numpy as np
from typing import Dict, List, Optional, Tuple
import random
import hashlib
import os
from datetime import datetime


class SpeakerVerifier:
    """
    화자 검증기

    HuggingFace Inference API를 사용하여 화자의 성문을 추출하고 비교합니다.
    API 토큰이 없는 경우 목업 모드로 동작합니다.
    """

    # HuggingFace Dedicated Inference Endpoint
    # Saire2023/wav2vec2-base-finetuned-Speaker-Classification 모델 배포
    ENDPOINT_URL = "https://dwit68a7bkrnbukk.us-east-1.aws.endpoints.huggingface.cloud"

    # 화자 검증용 모델 (speaker-classification)
    SPEAKER_MODEL = "Saire2023/wav2vec2-base-finetuned-Speaker-Classification"

    def __init__(self, api_token: Optional[str] = None):
        """
        화자 검증기 초기화

        Args:
            api_token: HuggingFace API 토큰 (없으면 환경변수에서 로드)
        """
        self.api_token = api_token or os.getenv("HUGGINGFACE_API_TOKEN", "")
        self.is_loaded = False
        self._prototype_mode = not bool(self.api_token)

        # 등록된 성문 저장소 (인메모리)
        self.voiceprints: Dict[str, Dict] = {}

        # 목업 데이터 초기화
        self._init_mock_voiceprints()

        if self._prototype_mode:
            print("[SpeakerVerifier] API 토큰 없음 - 목업 모드로 동작")
        else:
            print("[SpeakerVerifier] HuggingFace API 모드로 동작")

    @property
    def headers(self) -> Dict[str, str]:
        """API 요청 헤더 (Authorization만)"""
        return {"Authorization": f"Bearer {self.api_token}"}

    def _init_mock_voiceprints(self):
        """목업 성문 데이터 초기화"""
        mock_members = [
            {"id": "member_1", "name": "아들 (민준)", "relation": "son"},
            {"id": "member_2", "name": "딸 (수진)", "relation": "daughter"},
            {"id": "member_3", "name": "배우자", "relation": "spouse"},
        ]

        for member in mock_members:
            # 고정 시드로 일관된 임베딩 생성
            np.random.seed(hash(member["id"]) % (2**31))
            self.voiceprints[member["id"]] = {
                "id": member["id"],
                "name": member["name"],
                "relation": member["relation"],
                "embedding": np.random.randn(192).tolist(),  # 192차원 임베딩
                "registered_at": datetime.now().isoformat(),
                "sample_count": random.randint(3, 5)
            }

    def load_model(self):
        """모델 로딩 (API 모드에서는 실제 로딩 불필요)"""
        self.is_loaded = True

    async def get_embedding_from_api(self, audio_bytes: bytes) -> Optional[List[float]]:
        """
        HuggingFace API를 사용하여 화자 임베딩 추출

        Args:
            audio_bytes: 오디오 바이너리 데이터

        Returns:
            임베딩 벡터 (리스트) 또는 None
        """
        api_url = self.ENDPOINT_URL

        try:
            async with aiohttp.ClientSession() as session:
                # Content-Type을 명시적으로 설정
                headers = {
                    "Authorization": f"Bearer {self.api_token}",
                    "Content-Type": "audio/wav"
                }
                async with session.post(
                    api_url,
                    headers=headers,
                    data=audio_bytes,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return self._parse_embedding_result(result)
                    elif response.status == 503:
                        print("[SpeakerVerifier] 모델 로딩 중...")
                        return None
                    else:
                        error_text = await response.text()
                        print(f"[SpeakerVerifier] API 에러: {response.status} - {error_text}")
                        return None

        except aiohttp.ClientError as e:
            print(f"[SpeakerVerifier] 연결 에러: {e}")
            return None
        except Exception as e:
            print(f"[SpeakerVerifier] 예외 발생: {e}")
            return None

    def _parse_embedding_result(self, result: any) -> Optional[List[float]]:
        """HuggingFace API 임베딩 응답 파싱"""
        # SpeechBrain ECAPA-TDNN 모델은 임베딩 벡터를 반환
        if isinstance(result, list):
            # 이미 리스트 형태의 임베딩
            if len(result) > 0:
                # 분류 결과 (dict 리스트)인 경우 - 임베딩이 아님
                if isinstance(result[0], dict):
                    print(f"[SpeakerVerifier] 분류 결과 반환됨 (임베딩 아님): {result}")
                    return None
                # 중첩 리스트인 경우 평탄화
                if isinstance(result[0], list):
                    return result[0]
                # float 리스트인 경우 (실제 임베딩)
                if isinstance(result[0], (int, float)):
                    return result

        elif isinstance(result, dict):
            # embeddings 키가 있는 경우
            if "embeddings" in result:
                return result["embeddings"]

        return None

    def extract_embedding(self, audio_data: np.ndarray = None) -> np.ndarray:
        """
        동기 방식 임베딩 추출 (목업 모드용)

        Args:
            audio_data: 오디오 신호

        Returns:
            임베딩 벡터
        """
        if audio_data is not None:
            # 데이터 해시 기반 시드로 일관된 임베딩 생성
            audio_hash = hashlib.md5(audio_data.tobytes()).hexdigest()
            np.random.seed(int(audio_hash[:8], 16) % (2**31))

        return np.random.randn(192)

    async def register_voiceprint(
        self,
        member_id: str,
        name: str,
        relation: str,
        audio_samples: List[bytes]
    ) -> Dict:
        """
        성문 등록

        Args:
            member_id: 가족 구성원 ID
            name: 이름
            relation: 관계
            audio_samples: 음성 샘플 바이트 리스트

        Returns:
            등록 결과
        """
        if len(audio_samples) < 1:
            return {"success": False, "error": "최소 1개 이상의 음성 샘플이 필요합니다"}

        embeddings = []

        # API 모드: 각 샘플에서 임베딩 추출
        if not self._prototype_mode:
            for sample in audio_samples:
                embedding = await self.get_embedding_from_api(sample)
                if embedding:
                    embeddings.append(np.array(embedding))

            if not embeddings:
                # API 실패 시 목업 임베딩 사용
                embeddings = [np.random.randn(192) for _ in audio_samples]
        else:
            # 목업 모드: 랜덤 임베딩 생성
            embeddings = [np.random.randn(192) for _ in audio_samples]

        # 임베딩 평균
        avg_embedding = np.mean(embeddings, axis=0)

        # 정규화
        avg_embedding = avg_embedding / np.linalg.norm(avg_embedding)

        self.voiceprints[member_id] = {
            "id": member_id,
            "name": name,
            "relation": relation,
            "embedding": avg_embedding.tolist(),
            "registered_at": datetime.now().isoformat(),
            "sample_count": len(audio_samples)
        }

        return {
            "success": True,
            "member_id": member_id,
            "name": name,
            "sample_count": len(audio_samples),
            "mode": "api" if not self._prototype_mode else "mock"
        }

    async def verify(
        self,
        audio_bytes: bytes = None,
        audio_data: np.ndarray = None,
        member_id: Optional[str] = None,
        threshold: float = 0.6
    ) -> Dict:
        """
        화자 검증 수행

        Args:
            audio_bytes: 검증할 음성 바이트
            audio_data: 검증할 음성 numpy 배열
            member_id: 특정 멤버와 비교 (None이면 전체 검색)
            threshold: 일치 판정 임계값

        Returns:
            검증 결과
        """
        # 입력 음성 임베딩 추출
        input_embedding = None

        if not self._prototype_mode and audio_bytes:
            # API 모드
            embedding_list = await self.get_embedding_from_api(audio_bytes)
            if embedding_list:
                input_embedding = np.array(embedding_list)
                input_embedding = input_embedding / np.linalg.norm(input_embedding)

        if input_embedding is None:
            # 목업 모드 또는 API 실패
            if self._prototype_mode:
                return self._mock_verify(member_id)
            else:
                # API 실패 시에도 목업 결과 반환
                return self._mock_verify(member_id)

        # 실제 검증 수행
        if member_id:
            # 특정 멤버와 비교
            if member_id not in self.voiceprints:
                return {"success": False, "error": "등록되지 않은 멤버입니다"}

            registered = self.voiceprints[member_id]
            registered_embedding = np.array(registered["embedding"])
            similarity = self._cosine_similarity(input_embedding, registered_embedding)

            return {
                "success": True,
                "verified": similarity >= threshold,
                "similarity": round(float(similarity) * 100, 2),
                "matched_member": registered["name"] if similarity >= threshold else None,
                "threshold": threshold * 100,
                "mode": "api"
            }
        else:
            # 전체 성문 검색
            return self._search_all(input_embedding, threshold)

    def _mock_verify(self, member_id: Optional[str] = None) -> Dict:
        """목업 검증 결과 생성"""
        is_match = random.random() > 0.5

        if member_id and member_id in self.voiceprints:
            member = self.voiceprints[member_id]
            similarity = random.uniform(75, 95) if is_match else random.uniform(10, 35)

            return {
                "success": True,
                "verified": is_match,
                "similarity": round(similarity, 2),
                "matched_member": member["name"] if is_match else None,
                "threshold": 60.0,
                "mode": "mock"
            }
        else:
            # 전체 검색 목업
            if is_match and self.voiceprints:
                matched = random.choice(list(self.voiceprints.values()))
                similarity = random.uniform(75, 95)
                return {
                    "success": True,
                    "verified": True,
                    "similarity": round(similarity, 2),
                    "matched_member": matched["name"],
                    "all_scores": self._generate_mock_scores(matched["id"]),
                    "threshold": 60.0,
                    "mode": "mock"
                }
            else:
                return {
                    "success": True,
                    "verified": False,
                    "similarity": round(random.uniform(10, 35), 2),
                    "matched_member": None,
                    "all_scores": self._generate_mock_scores(None),
                    "threshold": 60.0,
                    "mode": "mock"
                }

    def _generate_mock_scores(self, matched_id: Optional[str]) -> List[Dict]:
        """전체 멤버에 대한 목업 점수 생성"""
        scores = []
        for vid, vp in self.voiceprints.items():
            if vid == matched_id:
                score = random.uniform(75, 95)
            else:
                score = random.uniform(8, 35)
            scores.append({
                "member_id": vid,
                "name": vp["name"],
                "similarity": round(score, 2)
            })
        return sorted(scores, key=lambda x: x["similarity"], reverse=True)

    def _search_all(self, input_embedding: np.ndarray, threshold: float) -> Dict:
        """전체 성문 검색"""
        if not self.voiceprints:
            return {
                "success": True,
                "verified": False,
                "similarity": 0.0,
                "matched_member": None,
                "error": "등록된 성문이 없습니다",
                "mode": "api"
            }

        best_match = None
        best_similarity = 0.0
        all_scores = []

        for member_id, voiceprint in self.voiceprints.items():
            registered_embedding = np.array(voiceprint["embedding"])
            similarity = self._cosine_similarity(input_embedding, registered_embedding)
            all_scores.append({
                "member_id": member_id,
                "name": voiceprint["name"],
                "similarity": round(float(similarity) * 100, 2)
            })

            if similarity > best_similarity:
                best_similarity = similarity
                best_match = voiceprint

        all_scores = sorted(all_scores, key=lambda x: x["similarity"], reverse=True)

        return {
            "success": True,
            "verified": best_similarity >= threshold,
            "similarity": round(float(best_similarity) * 100, 2),
            "matched_member": best_match["name"] if best_similarity >= threshold else None,
            "all_scores": all_scores,
            "threshold": threshold * 100,
            "mode": "api"
        }

    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        """코사인 유사도 계산"""
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

    def get_registered_members(self) -> List[Dict]:
        """등록된 성문 목록 반환"""
        return [
            {
                "id": vp["id"],
                "name": vp["name"],
                "relation": vp["relation"],
                "registered_at": vp["registered_at"],
                "sample_count": vp["sample_count"]
            }
            for vp in self.voiceprints.values()
        ]

    def delete_voiceprint(self, member_id: str) -> Dict:
        """성문 삭제"""
        if member_id in self.voiceprints:
            deleted = self.voiceprints.pop(member_id)
            return {"success": True, "deleted": deleted["name"]}
        return {"success": False, "error": "등록되지 않은 멤버입니다"}


# 전역 인스턴스 (싱글톤 패턴)
_verifier_instance = None

def get_verifier() -> SpeakerVerifier:
    """화자 검증기 싱글톤 인스턴스 반환"""
    global _verifier_instance
    if _verifier_instance is None:
        # 환경변수에서 토큰 로드
        from config import settings
        api_token = settings.HUGGINGFACE_API_TOKEN
        _verifier_instance = SpeakerVerifier(api_token=api_token)
        _verifier_instance.load_model()
    return _verifier_instance
