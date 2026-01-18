# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Deep Truth (딥 트루스) - AI 딥페이크 음성 탐지 + 가족 성문 대조 이중 검증 서비스

**공모전**: 피싱·스캠 예방을 위한 서비스 개발 경진대회 (데이콘)
**마감일**: 2026.02.11 오전 10:00

**현재 상태**: 목업 모드 (랜덤 값 반환). HuggingFace Inference API로 실제 AI 기능 활성화 예정.

## Deployment URLs

- **Frontend**: https://deep-truth.vercel.app (Vercel)
- **Backend**: https://deep-truth-production.up.railway.app (Railway)
- **API Docs**: https://deep-truth-production.up.railway.app/docs
- **GitHub**: https://github.com/yonghwan1106/deep-truth

## Development Commands

### Frontend (React + Vite)
```bash
cd frontend
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:5173)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 미리보기
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt    # 의존성 설치
uvicorn main:app --reload --port 8000   # 개발 서버
python main.py                     # 직접 실행
```

## Architecture

```
프론트엔드 (Vercel)          백엔드 (Railway)           외부 AI API
     │                            │                        │
     │  fetch API                 │    HuggingFace API     │
     └──────────────────────────→ FastAPI ───────────────→ │
                                   │                        │
                     ┌─────────────┼─────────────┐          │
                     │             │             │          │
                  /analyze    /voiceprint   /family-code    │
                     │             │             │          │
                     ▼             ▼             │          │
              ┌──────────────────────┐           │          │
              │  HuggingFace API     │           │          │
              │  (Inference API)     │◀──────────┼──────────┘
              ├──────────────────────┤
              │ • Wav2Vec2 (딥페이크)│
              │ • ECAPA-TDNN (화자)  │
              └──────────────────────┘
```

### Backend Structure
- `main.py` - FastAPI 앱 엔트리포인트, CORS 설정
- `routers/` - API 엔드포인트 (analysis, voiceprint, family_code, history)
- `models/` - AI 모델 래퍼 (deepfake_detector.py, speaker_verifier.py)
- `utils/audio_processor.py` - 오디오 전처리

### Frontend Structure
- `src/pages/` - 라우트별 페이지 컴포넌트
- `src/components/` - 재사용 UI 컴포넌트
- `src/services/api.js` - 백엔드 API 통신 모듈

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze/` | 음성 분석 (딥페이크 + 성문) |
| POST | `/api/analyze/quick` | 빠른 딥페이크 분석 |
| POST | `/api/voiceprint/register` | 성문 등록 |
| GET | `/api/voiceprint/list` | 성문 목록 |
| POST | `/api/family-code/register` | 가족 암호 등록 |
| POST | `/api/family-code/verify` | 가족 암호 검증 |
| GET | `/api/history` | 분석 이력 |

## Implementing Real AI Features (HuggingFace Inference API)

**Railway 업그레이드 없이** HuggingFace Inference API를 사용하여 실제 AI 기능 활성화.

### Step 1: HuggingFace API 토큰 발급
1. https://huggingface.co/settings/tokens 에서 토큰 생성
2. `backend/.env`에 추가: `HUGGINGFACE_API_TOKEN=hf_xxxxx`

### Step 2: 백엔드 코드 수정

#### requirements.txt 추가
```
requests==2.31.0
aiohttp==3.9.1
```

#### models/deepfake_detector.py 수정
```python
import aiohttp
import os

HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/wav2vec2-base"
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

async def detect_deepfake(audio_bytes: bytes) -> dict:
    headers = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}
    async with aiohttp.ClientSession() as session:
        async with session.post(HUGGINGFACE_API_URL, headers=headers, data=audio_bytes) as response:
            result = await response.json()
            # 결과 파싱 및 반환
            return {"deepfake_probability": parse_result(result)}
```

#### models/speaker_verifier.py 수정
```python
# speechbrain/spkrec-ecapa-voxceleb 모델 사용
SPEAKER_MODEL_URL = "https://api-inference.huggingface.co/models/speechbrain/spkrec-ecapa-voxceleb"
```

### Step 3: Railway 환경변수 설정
Railway 대시보드 → Variables 탭에서 `HUGGINGFACE_API_TOKEN` 추가

### 사용 가능한 HuggingFace 모델
| 용도 | 모델 | URL |
|------|------|-----|
| 딥페이크 탐지 | wav2vec2-base | `facebook/wav2vec2-base` |
| 화자 검증 | ECAPA-TDNN | `speechbrain/spkrec-ecapa-voxceleb` |
| 음성 분류 | wav2vec2-large | `facebook/wav2vec2-large-960h` |

### HuggingFace Inference API 제한
- **무료 티어**: 월 30,000 요청
- **Rate Limit**: 분당 ~30 요청
- **응답 시간**: 1-5초 (모델에 따라 다름)

## Git Workflow

- 브랜치: `master`
- 푸시하면 자동 배포:
  - Frontend → Vercel
  - Backend → Railway

```bash
git add .
git commit -m "feat: 기능 설명"
git push origin master
```

## Environment Variables

### Frontend (`VITE_API_URL`)
기본값: `https://deep-truth-production.up.railway.app/api`
로컬 개발시: `http://localhost:8000/api`

### Backend
- `HUGGINGFACE_API_TOKEN` - HuggingFace API 토큰 (필수)
- `backend/config.py`에서 설정 관리
- `.env` 파일 지원

## 대회 제출 체크리스트

- [ ] HuggingFace Inference API로 실제 AI 기능 구현
- [ ] MVP 제안서 PDF 작성 (양식에 맞게)
- [ ] 시연 영상 제작 (5분 이내, 유튜브 업로드)
- [ ] 데모 웹 링크 확인
- [ ] 코드 공유 페이지에 '비공개'로 업로드

**마감: 2026.02.11 오전 10:00**
