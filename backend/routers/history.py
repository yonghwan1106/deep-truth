"""
분석 이력 관리 API 라우터
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

# 목업 이력 데이터
history_db = [
    {
        "id": "1",
        "file_name": "voice_message_1.mp3",
        "date": "2025-01-18T14:32:00",
        "deepfake_probability": 87,
        "voiceprint_match": 12,
        "matched_person": "아들 (민준)",
        "risk_level": "high"
    },
    {
        "id": "2",
        "file_name": "kakao_voice.m4a",
        "date": "2025-01-17T09:15:00",
        "deepfake_probability": 15,
        "voiceprint_match": 92,
        "matched_person": "딸 (수진)",
        "risk_level": "low"
    },
    {
        "id": "3",
        "file_name": "unknown_call.wav",
        "date": "2025-01-15T18:45:00",
        "deepfake_probability": 62,
        "voiceprint_match": 45,
        "matched_person": "배우자",
        "risk_level": "medium"
    }
]


class HistoryItem(BaseModel):
    id: str
    file_name: str
    date: str
    deepfake_probability: float
    voiceprint_match: float
    matched_person: Optional[str]
    risk_level: str


class HistoryStats(BaseModel):
    total: int
    high_risk: int
    medium_risk: int
    low_risk: int


@router.get("/", response_model=List[HistoryItem])
async def get_history(limit: int = 50, offset: int = 0):
    """분석 이력 조회"""
    return history_db[offset:offset + limit]


@router.get("/stats", response_model=HistoryStats)
async def get_history_stats():
    """분석 이력 통계"""
    return HistoryStats(
        total=len(history_db),
        high_risk=len([h for h in history_db if h["risk_level"] == "high"]),
        medium_risk=len([h for h in history_db if h["risk_level"] == "medium"]),
        low_risk=len([h for h in history_db if h["risk_level"] == "low"])
    )


@router.get("/{history_id}", response_model=HistoryItem)
async def get_history_item(history_id: str):
    """특정 분석 이력 상세 조회"""
    for item in history_db:
        if item["id"] == history_id:
            return item
    return None


@router.delete("/{history_id}")
async def delete_history_item(history_id: str):
    """분석 이력 삭제"""
    global history_db
    history_db = [h for h in history_db if h["id"] != history_id]
    return {"message": "이력이 삭제되었습니다"}
