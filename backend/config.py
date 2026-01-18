"""
Deep Truth 설정 파일
"""
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # 앱 설정
    APP_NAME: str = "Deep Truth API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # 경로 설정
    BASE_DIR: Path = Path(__file__).parent
    DATA_DIR: Path = BASE_DIR / "data"
    VOICEPRINTS_DIR: Path = DATA_DIR / "voiceprints"
    REAL_VOICES_DIR: Path = DATA_DIR / "real_voices"
    FAKE_VOICES_DIR: Path = DATA_DIR / "fake_voices"

    # 오디오 설정
    SAMPLE_RATE: int = 16000
    MIN_AUDIO_DURATION: float = 1.0  # 최소 1초
    MAX_AUDIO_DURATION: float = 60.0  # 최대 60초

    # 모델 설정
    DEEPFAKE_THRESHOLD: float = 0.5
    SPEAKER_VERIFICATION_THRESHOLD: float = 0.7

    # CORS 설정
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://deep-truth.vercel.app"
    ]

    class Config:
        env_file = ".env"

settings = Settings()

# 디렉토리 생성
settings.VOICEPRINTS_DIR.mkdir(parents=True, exist_ok=True)
settings.REAL_VOICES_DIR.mkdir(parents=True, exist_ok=True)
settings.FAKE_VOICES_DIR.mkdir(parents=True, exist_ok=True)
