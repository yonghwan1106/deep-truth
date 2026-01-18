"""
성문(Voiceprint) 등록 및 관리 API 라우터
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

router = APIRouter()

# 인메모리 저장소 (실제로는 DB 사용)
voiceprints_db = {
    "1": {
        "id": "1",
        "name": "아들 (민준)",
        "relationship": "아들",
        "sample_count": 3,
        "created_at": "2025-01-10T10:00:00",
        "updated_at": "2025-01-15T14:30:00"
    },
    "2": {
        "id": "2",
        "name": "딸 (수진)",
        "relationship": "딸",
        "sample_count": 2,
        "created_at": "2025-01-12T11:00:00",
        "updated_at": "2025-01-12T11:00:00"
    }
}


class VoiceprintCreate(BaseModel):
    name: str
    relationship: str


class VoiceprintResponse(BaseModel):
    id: str
    name: str
    relationship: str
    sample_count: int
    created_at: str
    updated_at: str


@router.get("/list", response_model=List[VoiceprintResponse])
async def list_voiceprints():
    """등록된 성문 목록 조회"""
    return list(voiceprints_db.values())


@router.post("/register", response_model=VoiceprintResponse)
async def register_voiceprint(data: VoiceprintCreate):
    """새 성문 등록"""
    new_id = str(uuid.uuid4())[:8]
    now = datetime.now().isoformat()

    voiceprint = {
        "id": new_id,
        "name": data.name,
        "relationship": data.relationship,
        "sample_count": 0,
        "created_at": now,
        "updated_at": now
    }

    voiceprints_db[new_id] = voiceprint
    return voiceprint


@router.post("/{voiceprint_id}/sample")
async def add_voice_sample(voiceprint_id: str, file: UploadFile = File(...)):
    """성문에 음성 샘플 추가"""
    if voiceprint_id not in voiceprints_db:
        raise HTTPException(status_code=404, detail="성문을 찾을 수 없습니다")

    # 파일 처리 (실제로는 특징 벡터 추출)
    content = await file.read()

    voiceprints_db[voiceprint_id]["sample_count"] += 1
    voiceprints_db[voiceprint_id]["updated_at"] = datetime.now().isoformat()

    return {
        "message": "음성 샘플이 추가되었습니다",
        "sample_count": voiceprints_db[voiceprint_id]["sample_count"]
    }


@router.delete("/{voiceprint_id}")
async def delete_voiceprint(voiceprint_id: str):
    """성문 삭제"""
    if voiceprint_id not in voiceprints_db:
        raise HTTPException(status_code=404, detail="성문을 찾을 수 없습니다")

    del voiceprints_db[voiceprint_id]
    return {"message": "성문이 삭제되었습니다"}


@router.post("/verify")
async def verify_voiceprint(voiceprint_id: str, file: UploadFile = File(...)):
    """음성과 등록된 성문 대조"""
    if voiceprint_id not in voiceprints_db:
        raise HTTPException(status_code=404, detail="성문을 찾을 수 없습니다")

    content = await file.read()

    # 목업 결과 (실제로는 AI 모델로 유사도 계산)
    import random
    similarity = random.uniform(10, 95)

    return {
        "voiceprint_id": voiceprint_id,
        "name": voiceprints_db[voiceprint_id]["name"],
        "similarity": round(similarity, 1),
        "is_match": similarity > 70
    }
