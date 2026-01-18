"""
가족 암호 관리 API 라우터
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import uuid
import hashlib

router = APIRouter()

# 인메모리 저장소 (실제로는 암호화하여 DB 저장)
family_codes_db = {
    "1": {
        "id": "1",
        "name": "아들 (민준)",
        "question": "첫 자전거를 산 나이는?",
        "answer_hash": hashlib.sha256("7살".encode()).hexdigest()
    },
    "2": {
        "id": "2",
        "name": "딸 (수진)",
        "question": "좋아하는 아이스크림 맛은?",
        "answer_hash": hashlib.sha256("민트초코".encode()).hexdigest()
    }
}


class FamilyCodeCreate(BaseModel):
    name: str
    question: str
    answer: str


class FamilyCodeResponse(BaseModel):
    id: str
    name: str
    question: str


class FamilyCodeVerify(BaseModel):
    code_id: str
    answer: str


@router.get("/list", response_model=List[FamilyCodeResponse])
async def list_family_codes():
    """등록된 가족 암호 목록 조회 (답변 제외)"""
    return [
        FamilyCodeResponse(id=c["id"], name=c["name"], question=c["question"])
        for c in family_codes_db.values()
    ]


@router.post("/register", response_model=FamilyCodeResponse)
async def register_family_code(data: FamilyCodeCreate):
    """새 가족 암호 등록"""
    new_id = str(uuid.uuid4())[:8]

    family_code = {
        "id": new_id,
        "name": data.name,
        "question": data.question,
        "answer_hash": hashlib.sha256(data.answer.lower().encode()).hexdigest()
    }

    family_codes_db[new_id] = family_code

    return FamilyCodeResponse(
        id=new_id,
        name=data.name,
        question=data.question
    )


@router.post("/verify")
async def verify_family_code(data: FamilyCodeVerify):
    """가족 암호 검증"""
    if data.code_id not in family_codes_db:
        raise HTTPException(status_code=404, detail="암호를 찾을 수 없습니다")

    code = family_codes_db[data.code_id]
    answer_hash = hashlib.sha256(data.answer.lower().encode()).hexdigest()
    is_match = answer_hash == code["answer_hash"]

    return {
        "code_id": data.code_id,
        "name": code["name"],
        "is_match": is_match,
        "message": "암호가 일치합니다!" if is_match else "암호가 일치하지 않습니다."
    }


@router.delete("/{code_id}")
async def delete_family_code(code_id: str):
    """가족 암호 삭제"""
    if code_id not in family_codes_db:
        raise HTTPException(status_code=404, detail="암호를 찾을 수 없습니다")

    del family_codes_db[code_id]
    return {"message": "암호가 삭제되었습니다"}


@router.put("/{code_id}")
async def update_family_code(code_id: str, data: FamilyCodeCreate):
    """가족 암호 수정"""
    if code_id not in family_codes_db:
        raise HTTPException(status_code=404, detail="암호를 찾을 수 없습니다")

    family_codes_db[code_id] = {
        "id": code_id,
        "name": data.name,
        "question": data.question,
        "answer_hash": hashlib.sha256(data.answer.lower().encode()).hexdigest()
    }

    return FamilyCodeResponse(
        id=code_id,
        name=data.name,
        question=data.question
    )
