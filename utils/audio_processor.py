"""
오디오 처리 유틸리티
음성 파일 전처리 및 변환
"""

import io
import struct
import numpy as np
from typing import Tuple, Optional, BinaryIO
import random


class AudioProcessor:
    """
    오디오 처리 유틸리티

    지원 포맷: WAV, MP3, M4A, OGG (프로토타입에서는 목업)
    """

    SUPPORTED_FORMATS = ['wav', 'mp3', 'm4a', 'ogg', 'flac', 'webm']
    TARGET_SAMPLE_RATE = 16000  # 모델 입력용 표준 샘플레이트

    def __init__(self):
        self._prototype_mode = True

    def load_audio(self, file_data: bytes, file_format: str = 'wav') -> Tuple[np.ndarray, int]:
        """
        오디오 파일 로드

        Args:
            file_data: 오디오 파일 바이트 데이터
            file_format: 파일 포맷

        Returns:
            (오디오 신호, 샘플레이트)
        """
        if self._prototype_mode:
            # 목업: 파일 크기 기반으로 임의 오디오 생성
            duration = len(file_data) / 32000  # 대략적인 duration 추정
            duration = max(1.0, min(duration, 30.0))  # 1초 ~ 30초 제한
            num_samples = int(duration * self.TARGET_SAMPLE_RATE)
            audio = np.random.randn(num_samples) * 0.3  # 낮은 진폭의 노이즈
            return audio.astype(np.float32), self.TARGET_SAMPLE_RATE

        # 실제 구현:
        # import librosa
        # audio, sr = librosa.load(io.BytesIO(file_data), sr=self.TARGET_SAMPLE_RATE)
        # return audio, sr

    def load_wav(self, file_data: bytes) -> Tuple[np.ndarray, int]:
        """
        WAV 파일 간이 파서 (순수 Python)

        실제 구현에서는 librosa/scipy를 사용하지만,
        프로토타입에서는 간단한 WAV 파싱을 수행합니다.
        """
        try:
            # WAV 헤더 파싱
            riff = file_data[:4]
            if riff != b'RIFF':
                return self.load_audio(file_data)

            # 청크 사이즈 및 포맷 확인
            wave = file_data[8:12]
            if wave != b'WAVE':
                return self.load_audio(file_data)

            # fmt 청크 찾기
            pos = 12
            sample_rate = 16000
            channels = 1
            bits_per_sample = 16

            while pos < len(file_data) - 8:
                chunk_id = file_data[pos:pos+4]
                chunk_size = struct.unpack('<I', file_data[pos+4:pos+8])[0]

                if chunk_id == b'fmt ':
                    fmt_data = file_data[pos+8:pos+8+chunk_size]
                    audio_format = struct.unpack('<H', fmt_data[0:2])[0]
                    channels = struct.unpack('<H', fmt_data[2:4])[0]
                    sample_rate = struct.unpack('<I', fmt_data[4:8])[0]
                    bits_per_sample = struct.unpack('<H', fmt_data[14:16])[0]

                elif chunk_id == b'data':
                    audio_data = file_data[pos+8:pos+8+chunk_size]

                    # PCM 데이터를 numpy 배열로 변환
                    if bits_per_sample == 16:
                        samples = np.frombuffer(audio_data, dtype=np.int16)
                        audio = samples.astype(np.float32) / 32768.0
                    elif bits_per_sample == 8:
                        samples = np.frombuffer(audio_data, dtype=np.uint8)
                        audio = (samples.astype(np.float32) - 128) / 128.0
                    else:
                        audio = np.random.randn(len(audio_data) // 2) * 0.3

                    # 스테레오를 모노로 변환
                    if channels == 2:
                        audio = audio.reshape(-1, 2).mean(axis=1)

                    return audio.astype(np.float32), sample_rate

                pos += 8 + chunk_size
                if chunk_size % 2:  # 패딩
                    pos += 1

            # data 청크를 찾지 못한 경우
            return self.load_audio(file_data)

        except Exception as e:
            print(f"WAV 파싱 오류: {e}")
            return self.load_audio(file_data)

    def preprocess(self, audio: np.ndarray, sample_rate: int) -> np.ndarray:
        """
        오디오 전처리

        - 리샘플링 (16kHz로 통일)
        - 정규화
        - 노이즈 제거 (선택)

        Args:
            audio: 원본 오디오 신호
            sample_rate: 원본 샘플레이트

        Returns:
            전처리된 오디오
        """
        if self._prototype_mode:
            # 간단한 정규화만 수행
            audio = audio / (np.max(np.abs(audio)) + 1e-8)
            return audio.astype(np.float32)

        # 실제 구현:
        # import librosa
        # # 리샘플링
        # if sample_rate != self.TARGET_SAMPLE_RATE:
        #     audio = librosa.resample(audio, orig_sr=sample_rate, target_sr=self.TARGET_SAMPLE_RATE)
        # # 정규화
        # audio = librosa.util.normalize(audio)
        # return audio

    def get_duration(self, audio: np.ndarray, sample_rate: int) -> float:
        """오디오 길이(초) 계산"""
        return len(audio) / sample_rate

    def extract_mel_spectrogram(self, audio: np.ndarray, sample_rate: int = 16000) -> np.ndarray:
        """
        멜-스펙트로그램 추출

        Args:
            audio: 오디오 신호
            sample_rate: 샘플레이트

        Returns:
            멜-스펙트로그램 (n_mels x time)
        """
        if self._prototype_mode:
            # 목업: 임의의 멜-스펙트로그램 생성
            n_mels = 80
            n_frames = len(audio) // 160  # hop_length=160 가정
            mel_spec = np.random.randn(n_mels, max(1, n_frames)) * 0.5 + 2.0
            return mel_spec.astype(np.float32)

        # 실제 구현:
        # import librosa
        # mel_spec = librosa.feature.melspectrogram(
        #     y=audio, sr=sample_rate,
        #     n_fft=400, hop_length=160, n_mels=80
        # )
        # mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
        # return mel_spec_db

    def validate_audio(self, audio: np.ndarray, sample_rate: int) -> dict:
        """
        오디오 유효성 검사

        Returns:
            검사 결과 딕셔너리
        """
        duration = self.get_duration(audio, sample_rate)
        rms = np.sqrt(np.mean(audio ** 2))

        issues = []
        is_valid = True

        # 최소 길이 검사 (3초 권장)
        if duration < 1.0:
            issues.append("오디오가 너무 짧습니다 (최소 1초)")
            is_valid = False
        elif duration < 3.0:
            issues.append("정확한 분석을 위해 3초 이상의 음성을 권장합니다")

        # 최대 길이 검사
        if duration > 60.0:
            issues.append("오디오가 너무 깁니다 (최대 60초)")
            is_valid = False

        # 음량 검사
        if rms < 0.001:
            issues.append("음량이 너무 낮습니다 (무음 또는 잡음)")
            is_valid = False
        elif rms < 0.01:
            issues.append("음량이 낮습니다 - 분석 정확도가 떨어질 수 있습니다")

        return {
            "is_valid": is_valid,
            "duration": round(duration, 2),
            "sample_rate": sample_rate,
            "rms_level": round(float(rms), 4),
            "issues": issues
        }

    def trim_silence(self, audio: np.ndarray, threshold: float = 0.01) -> np.ndarray:
        """
        앞뒤 무음 구간 제거

        Args:
            audio: 오디오 신호
            threshold: 무음 판정 임계값

        Returns:
            트리밍된 오디오
        """
        if self._prototype_mode:
            return audio  # 프로토타입에서는 트리밍 생략

        # 에너지 기반 음성 구간 탐지
        energy = np.abs(audio)
        mask = energy > threshold

        # 첫 번째와 마지막 음성 구간 찾기
        indices = np.where(mask)[0]
        if len(indices) == 0:
            return audio  # 전체가 무음이면 원본 반환

        start = max(0, indices[0] - 1000)  # 약간의 여유
        end = min(len(audio), indices[-1] + 1000)

        return audio[start:end]


# 전역 인스턴스
_processor_instance = None

def get_processor() -> AudioProcessor:
    """오디오 프로세서 싱글톤 인스턴스 반환"""
    global _processor_instance
    if _processor_instance is None:
        _processor_instance = AudioProcessor()
    return _processor_instance
