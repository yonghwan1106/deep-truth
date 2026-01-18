"""
헬퍼 유틸리티 함수
"""

import uuid
from datetime import datetime
from typing import Tuple, List


def generate_id(prefix: str = "") -> str:
    """
    고유 ID 생성

    Args:
        prefix: ID 접두사 (예: "analysis_", "voiceprint_")

    Returns:
        고유 ID 문자열
    """
    unique_id = str(uuid.uuid4())[:8]
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"{prefix}{timestamp}_{unique_id}" if prefix else f"{timestamp}_{unique_id}"


def format_timestamp(dt: datetime = None) -> str:
    """
    타임스탬프 포맷팅

    Args:
        dt: datetime 객체 (None이면 현재 시각)

    Returns:
        ISO 포맷 문자열
    """
    if dt is None:
        dt = datetime.now()
    return dt.isoformat()


def calculate_risk_level(
    deepfake_probability: float,
    voiceprint_match: float
) -> Tuple[str, List[str]]:
    """
    위험도 레벨 계산

    Args:
        deepfake_probability: 딥페이크 확률 (0-100)
        voiceprint_match: 성문 일치율 (0-100)

    Returns:
        (위험도 레벨, 권장 조치 리스트)
    """
    # 위험도 점수 계산 (딥페이크 확률 높을수록, 성문 일치 낮을수록 위험)
    risk_score = deepfake_probability * 0.6 + (100 - voiceprint_match) * 0.4

    if risk_score >= 70 or deepfake_probability >= 80 or voiceprint_match <= 20:
        level = "critical"
        recommendations = [
            "높은 확률로 위조된 음성입니다",
            "절대로 금전을 송금하지 마세요",
            "본인에게 영상통화로 직접 확인하세요",
            "경찰청 112에 즉시 신고하세요",
            "이 음성을 증거로 보관하세요"
        ]
    elif risk_score >= 50 or deepfake_probability >= 60 or voiceprint_match <= 40:
        level = "high"
        recommendations = [
            "위조 가능성이 높은 음성입니다",
            "송금이나 개인정보 제공을 자제하세요",
            "본인에게 다른 수단으로 연락하여 확인하세요",
            "가족 암호를 통해 추가 확인하세요"
        ]
    elif risk_score >= 30 or deepfake_probability >= 40 or voiceprint_match <= 60:
        level = "medium"
        recommendations = [
            "주의가 필요한 음성입니다",
            "추가 확인을 권장합니다",
            "의심스러운 요청은 직접 확인하세요"
        ]
    else:
        level = "low"
        recommendations = [
            "정상적인 음성으로 판단됩니다",
            "그래도 중요한 결정 전에는 직접 확인을 권장합니다"
        ]

    return level, recommendations


def parse_content_type(content_type: str) -> str:
    """
    Content-Type에서 파일 포맷 추출

    Args:
        content_type: MIME type 문자열

    Returns:
        파일 확장자
    """
    mime_to_ext = {
        'audio/mpeg': 'mp3',
        'audio/mp3': 'mp3',
        'audio/wav': 'wav',
        'audio/x-wav': 'wav',
        'audio/wave': 'wav',
        'audio/mp4': 'm4a',
        'audio/m4a': 'm4a',
        'audio/x-m4a': 'm4a',
        'audio/ogg': 'ogg',
        'audio/vorbis': 'ogg',
        'audio/flac': 'flac',
        'audio/webm': 'webm'
    }

    return mime_to_ext.get(content_type, 'wav')


def format_duration(seconds: float) -> str:
    """
    초를 분:초 형식으로 변환

    Args:
        seconds: 초 단위 시간

    Returns:
        "MM:SS" 형식 문자열
    """
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes:02d}:{secs:02d}"


def validate_family_code_answer(registered: str, provided: str) -> bool:
    """
    가족 암호 답변 검증

    대소문자 무시, 공백 정규화 후 비교

    Args:
        registered: 등록된 답변
        provided: 제공된 답변

    Returns:
        일치 여부
    """
    def normalize(s: str) -> str:
        return ' '.join(s.lower().strip().split())

    return normalize(registered) == normalize(provided)


def generate_analysis_summary(
    deepfake_prob: float,
    voiceprint_match: float,
    matched_person: str = None,
    risk_level: str = "medium"
) -> str:
    """
    분석 결과 요약 텍스트 생성

    Args:
        deepfake_prob: 딥페이크 확률
        voiceprint_match: 성문 일치율
        matched_person: 매칭된 가족 이름
        risk_level: 위험도 레벨

    Returns:
        요약 텍스트
    """
    risk_emoji = {
        "critical": "🚨",
        "high": "⚠️",
        "medium": "⚡",
        "low": "✅"
    }.get(risk_level, "❓")

    if risk_level in ["critical", "high"]:
        summary = f"{risk_emoji} 주의: 딥페이크 확률 {deepfake_prob:.1f}%"
        if voiceprint_match < 30:
            summary += f", 등록된 가족과 일치하지 않음 ({voiceprint_match:.1f}%)"
    else:
        summary = f"{risk_emoji} 분석 완료: 딥페이크 확률 {deepfake_prob:.1f}%"
        if matched_person and voiceprint_match > 70:
            summary += f", {matched_person}과(와) {voiceprint_match:.1f}% 일치"

    return summary
