"""
화자 검증 모듈
ECAPA-TDNN 기반 성문(Voiceprint) 검증
"""

import numpy as np
from typing import Dict, List, Optional, Tuple
import random
import hashlib
from datetime import datetime


class SpeakerVerifier:
    """
    화자 검증기

    실제 구현에서는 SpeechBrain ECAPA-TDNN 모델을 사용하여
    화자의 성문(Voiceprint)을 추출하고 비교합니다.

    프로토타입에서는 목업 결과를 반환합니다.
    """

    def __init__(self, model_path: Optional[str] = None):
        """
        화자 검증기 초기화

        Args:
            model_path: 사전학습된 모델 경로 (선택)
        """
        self.model_path = model_path
        self.model = None
        self.is_loaded = False

        # 등록된 성문 저장소 (프로토타입용 인메모리)
        self.voiceprints: Dict[str, Dict] = {}

        # 프로토타입 모드
        self._prototype_mode = True

        # 목업 데이터 초기화
        self._init_mock_voiceprints()

    def _init_mock_voiceprints(self):
        """목업 성문 데이터 초기화"""
        mock_members = [
            {"id": "member_1", "name": "아들 (민준)", "relation": "son"},
            {"id": "member_2", "name": "딸 (수진)", "relation": "daughter"},
            {"id": "member_3", "name": "배우자", "relation": "spouse"},
        ]

        for member in mock_members:
            self.voiceprints[member["id"]] = {
                "id": member["id"],
                "name": member["name"],
                "relation": member["relation"],
                "embedding": np.random.randn(192),  # ECAPA-TDNN 192차원 임베딩
                "registered_at": datetime.now().isoformat(),
                "sample_count": random.randint(3, 5)
            }

    def load_model(self):
        """
        ECAPA-TDNN 모델 로딩

        실제 구현:
        from speechbrain.pretrained import EncoderClassifier
        self.model = EncoderClassifier.from_hparams(
            source="speechbrain/spkrec-ecapa-voxceleb"
        )
        """
        if self._prototype_mode:
            self.is_loaded = True
            return

        # 실제 모델 로딩 코드 (프로토타입에서는 비활성화)

    def extract_embedding(self, audio_data: np.ndarray, sample_rate: int = 16000) -> np.ndarray:
        """
        화자 임베딩(성문) 추출

        Args:
            audio_data: 오디오 신호
            sample_rate: 샘플링 레이트

        Returns:
            192차원 화자 임베딩 벡터
        """
        if self._prototype_mode:
            # 목업: 랜덤 임베딩 생성 (재현 가능하도록 해시 기반)
            audio_hash = hashlib.md5(audio_data.tobytes()).hexdigest()
            np.random.seed(int(audio_hash[:8], 16) % (2**31))
            return np.random.randn(192)

        # 실제 구현:
        # signal = torch.tensor(audio_data).unsqueeze(0)
        # embedding = self.model.encode_batch(signal)
        # return embedding.squeeze().numpy()

    def register_voiceprint(
        self,
        member_id: str,
        name: str,
        relation: str,
        audio_samples: List[np.ndarray]
    ) -> Dict:
        """
        성문 등록

        Args:
            member_id: 가족 구성원 ID
            name: 이름
            relation: 관계 (son, daughter, spouse, parent 등)
            audio_samples: 음성 샘플 리스트 (최소 3개 권장)

        Returns:
            등록 결과
        """
        if len(audio_samples) < 1:
            return {"success": False, "error": "최소 1개 이상의 음성 샘플이 필요합니다"}

        # 각 샘플에서 임베딩 추출 후 평균
        embeddings = [self.extract_embedding(sample) for sample in audio_samples]
        avg_embedding = np.mean(embeddings, axis=0)

        # 정규화
        avg_embedding = avg_embedding / np.linalg.norm(avg_embedding)

        self.voiceprints[member_id] = {
            "id": member_id,
            "name": name,
            "relation": relation,
            "embedding": avg_embedding,
            "registered_at": datetime.now().isoformat(),
            "sample_count": len(audio_samples)
        }

        return {
            "success": True,
            "member_id": member_id,
            "name": name,
            "sample_count": len(audio_samples)
        }

    def verify(
        self,
        audio_data: np.ndarray,
        member_id: Optional[str] = None,
        threshold: float = 0.6
    ) -> Dict:
        """
        화자 검증 수행

        Args:
            audio_data: 검증할 음성
            member_id: 특정 멤버와 비교 (None이면 전체 검색)
            threshold: 일치 판정 임계값

        Returns:
            검증 결과
        """
        if self._prototype_mode:
            return self._mock_verify(member_id)

        # 입력 음성 임베딩 추출
        input_embedding = self.extract_embedding(audio_data)
        input_embedding = input_embedding / np.linalg.norm(input_embedding)

        if member_id:
            # 특정 멤버와 비교
            if member_id not in self.voiceprints:
                return {"success": False, "error": "등록되지 않은 멤버입니다"}

            registered = self.voiceprints[member_id]
            similarity = self._cosine_similarity(input_embedding, registered["embedding"])

            return {
                "success": True,
                "verified": similarity >= threshold,
                "similarity": round(float(similarity) * 100, 2),
                "matched_member": registered["name"] if similarity >= threshold else None,
                "threshold": threshold * 100
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
                "threshold": 60.0
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
                    "threshold": 60.0
                }
            else:
                return {
                    "success": True,
                    "verified": False,
                    "similarity": round(random.uniform(10, 35), 2),
                    "matched_member": None,
                    "all_scores": self._generate_mock_scores(None),
                    "threshold": 60.0
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
                "error": "등록된 성문이 없습니다"
            }

        best_match = None
        best_similarity = 0.0
        all_scores = []

        for member_id, voiceprint in self.voiceprints.items():
            similarity = self._cosine_similarity(input_embedding, voiceprint["embedding"])
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
            "threshold": threshold * 100
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
        _verifier_instance = SpeakerVerifier()
        _verifier_instance.load_model()
    return _verifier_instance
