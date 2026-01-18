"""
Deep Truth API - FastAPI 메인 엔트리 포인트
딥페이크 음성 탐지 및 화자 검증 서비스
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

# 라우터 임포트
from routers import analysis, voiceprint, family_code, history

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="딥페이크 음성 탐지 및 화자 검증 API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(analysis.router, prefix="/api/analyze", tags=["Analysis"])
app.include_router(voiceprint.router, prefix="/api/voiceprint", tags=["Voiceprint"])
app.include_router(family_code.router, prefix="/api/family-code", tags=["Family Code"])
app.include_router(history.router, prefix="/api/history", tags=["History"])


@app.get("/")
async def root():
    """API 루트 엔드포인트"""
    return {
        "service": "Deep Truth API",
        "version": settings.APP_VERSION,
        "description": "딥페이크 음성 탐지 및 화자 검증 서비스",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """헬스체크 엔드포인트"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
