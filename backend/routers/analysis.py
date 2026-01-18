"""
음성 분석 API 라우터
딥페이크 탐지 + 화자 검증 통합 분석
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter()


class AnalysisResult(BaseModel):
    deepfake_probability: float
    voiceprint_match: float
    matched_person: Optional[str]
    risk_level: str
    recommendations: List[str]
    audio_duration: float
    analysis_time: float


@router.post("/", response_model=AnalysisResult)
async def analyze_audio(file: UploadFile = File(...)):
    """
    음성 파일 분석 - 딥페이크 탐지 + 성문 대조
    """
    # 파일 형식 검증
    allowed_types = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/ogg']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="지원하지 않는 오디오 형식입니다")

    # 파일 읽기 (실제로는 AI 모델에 전달)
    content = await file.read()
    file_size = len(content)

    # 목업 결과 생성 (실제로는 AI 모델 추론)
    is_deepfake = random.random() > 0.5
    deepfake_prob = random.uniform(70, 95) if is_deepfake else random.uniform(5, 30)
    voiceprint_match = random.uniform(5, 20) if is_deepfake else random.uniform(75, 98)

    # 위험도 판정
    if deepfake_prob > 70 or voiceprint_match < 30:
        risk_level = "high"
        recommendations = [
            "본인에게 영상통화로 직접 확인하세요",
            "경찰청 112에 신고하세요",
            "절대 송금하지 마세요"
        ]
    elif deepfake_prob > 40 or voiceprint_match < 60:
        risk_level = "medium"
        recommendations = [
            "추가 확인이 필요합니다",
            "본인에게 직접 연락하여 확인하세요"
        ]
    else:
        risk_level = "low"
        recommendations = [
            "정상적인 음성으로 판단됩니다",
            "그래도 의심되면 직접 확인하세요"
        ]

    return AnalysisResult(
        deepfake_probability=round(deepfake_prob, 1),
        voiceprint_match=round(voiceprint_match, 1),
        matched_person="아들 (민준)",
        risk_level=risk_level,
        recommendations=recommendations,
        audio_duration=round(file_size / 32000, 2),  # 추정값
        analysis_time=round(random.uniform(1.5, 3.0), 2)
    )


@router.post("/quick")
async def quick_analysis(file: UploadFile = File(...)):
    """
    빠른 분석 - 딥페이크 탐지만 수행
    """
    content = await file.read()

    # 목업 결과
    deepfake_prob = random.uniform(10, 90)

    return {
        "deepfake_probability": round(deepfake_prob, 1),
        "is_suspicious": deepfake_prob > 50
    }
