"""
음성 분석 API 라우터
딥페이크 탐지 + 화자 검증 통합 분석
HuggingFace Inference API 연동
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import time

from models.deepfake_detector import get_detector
from models.speaker_verifier import get_verifier

router = APIRouter()


class AnalysisResult(BaseModel):
    deepfake_probability: float
    voiceprint_match: float
    matched_person: Optional[str]
    risk_level: str
    recommendations: List[str]
    audio_duration: float
    analysis_time: float
    analysis_mode: str  # 'api' 또는 'mock'


class QuickAnalysisResult(BaseModel):
    deepfake_probability: float
    is_suspicious: bool
    analysis_mode: str


@router.post("/", response_model=AnalysisResult)
async def analyze_audio(file: UploadFile = File(...)):
    """
    음성 파일 분석 - 딥페이크 탐지 + 성문 대조

    HuggingFace Inference API를 사용하여 실제 AI 분석을 수행합니다.
    API 토큰이 없는 경우 목업 모드로 동작합니다.
    """
    # 파일 형식 검증
    allowed_types = [
        'audio/mpeg', 'audio/wav', 'audio/x-wav',
        'audio/mp4', 'audio/ogg', 'audio/webm',
        'audio/x-m4a', 'audio/flac'
    ]

    # content_type이 None인 경우도 허용 (파일 확장자로 판단)
    if file.content_type and file.content_type not in allowed_types:
        # 확장자 체크
        filename = file.filename or ""
        valid_extensions = ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.flac']
        if not any(filename.lower().endswith(ext) for ext in valid_extensions):
            raise HTTPException(status_code=400, detail="지원하지 않는 오디오 형식입니다")

    # 파일 읽기
    start_time = time.time()
    content = await file.read()
    file_size = len(content)

    # AI 모델 인스턴스 가져오기
    detector = get_detector()
    verifier = get_verifier()

    # 딥페이크 탐지 (HuggingFace API 또는 목업)
    deepfake_result = await detector.detect(audio_bytes=content)

    # 화자 검증 (HuggingFace API 또는 목업)
    voiceprint_result = await verifier.verify(audio_bytes=content)

    # 결과 추출
    deepfake_prob = deepfake_result.get("probability", 50.0)
    voiceprint_match = voiceprint_result.get("similarity", 0.0)
    matched_person = voiceprint_result.get("matched_member")

    # 분석 모드 확인
    deepfake_mode = deepfake_result.get("status", "mock")
    voiceprint_mode = voiceprint_result.get("mode", "mock")
    analysis_mode = "api" if deepfake_mode == "success" or voiceprint_mode == "api" else "mock"

    # 위험도 판정
    if deepfake_prob > 70 or voiceprint_match < 30:
        risk_level = "high"
        recommendations = [
            "⚠️ 본인에게 영상통화로 직접 확인하세요",
            "🚨 경찰청 112에 신고하세요",
            "💰 절대 송금하지 마세요"
        ]
    elif deepfake_prob > 40 or voiceprint_match < 60:
        risk_level = "medium"
        recommendations = [
            "📞 추가 확인이 필요합니다",
            "👤 본인에게 직접 연락하여 확인하세요"
        ]
    else:
        risk_level = "low"
        recommendations = [
            "✅ 정상적인 음성으로 판단됩니다",
            "💡 그래도 의심되면 직접 확인하세요"
        ]

    # 분석 시간 계산
    analysis_time = time.time() - start_time

    return AnalysisResult(
        deepfake_probability=round(deepfake_prob, 1),
        voiceprint_match=round(voiceprint_match, 1),
        matched_person=matched_person,
        risk_level=risk_level,
        recommendations=recommendations,
        audio_duration=round(file_size / 32000, 2),  # 추정값 (16kHz, 16bit)
        analysis_time=round(analysis_time, 2),
        analysis_mode=analysis_mode
    )


@router.post("/quick", response_model=QuickAnalysisResult)
async def quick_analysis(file: UploadFile = File(...)):
    """
    빠른 분석 - 딥페이크 탐지만 수행

    성문 대조 없이 딥페이크 여부만 빠르게 확인합니다.
    """
    content = await file.read()

    # AI 모델 인스턴스 가져오기
    detector = get_detector()

    # 딥페이크 탐지
    result = await detector.detect(audio_bytes=content)

    deepfake_prob = result.get("probability", 50.0)
    analysis_mode = result.get("status", "mock")

    return QuickAnalysisResult(
        deepfake_probability=round(deepfake_prob, 1),
        is_suspicious=deepfake_prob > 50,
        analysis_mode="api" if analysis_mode == "success" else "mock"
    )


@router.get("/status")
async def get_analysis_status():
    """
    분석 시스템 상태 확인

    HuggingFace API 연결 상태 및 모드를 반환합니다.
    """
    detector = get_detector()
    verifier = get_verifier()

    return {
        "deepfake_detector": {
            "mode": "api" if not detector._prototype_mode else "mock",
            "model": detector.DEEPFAKE_MODEL,
            "is_loaded": detector.is_loaded
        },
        "speaker_verifier": {
            "mode": "api" if not verifier._prototype_mode else "mock",
            "model": verifier.SPEAKER_MODEL,
            "is_loaded": verifier.is_loaded,
            "registered_members": len(verifier.voiceprints)
        }
    }
