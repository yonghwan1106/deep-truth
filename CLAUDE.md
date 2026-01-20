# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Deep Truth (딥 트루스) - AI 딥페이크 음성 탐지 + 가족 성문 대조 이중 검증 서비스

**공모전**: 피싱·스캠 예방을 위한 서비스 개발 경진대회 (데이콘)
**마감일**: 2026.02.11 오전 10:00

**현재 상태**: HuggingFace Dedicated Inference Endpoints 연동 진행 중 (API 인증 디버깅 필요)

## Deployment URLs

- **Frontend**: https://deep-truth.vercel.app (Vercel)
- **Backend**: https://deep-truth-production.up.railway.app (Railway)
- **API Docs**: https://deep-truth-production.up.railway.app/docs
- **GitHub**: https://github.com/yonghwan1106/deep-truth

## HuggingFace Inference Endpoints (2026-01-21 설정)

### 결제 정보
- **크레딧**: $20 충전 완료
- **예상 사용 시간**: ~149시간 (두 Endpoint 합산 $0.134/hr)

### Dedicated Endpoints

| 용도 | 모델 | Endpoint URL | 비용 |
|-----|------|--------------|------|
| **딥페이크 탐지** | MelodyMachine/Deepfake-audio-detection-V2 | `https://d5lc45iws9kwmc8t.us-east-1.aws.endpoints.huggingface.cloud` | $0.067/hr |
| **화자 검증** | Saire2023/wav2vec2-base-finetuned-Speaker-Classification | `https://dwit68a7bkrnbukk.us-east-1.aws.endpoints.huggingface.cloud` | $0.067/hr |

### Endpoint 설정
- **Instance**: Intel Sapphire Rapids 2x vCPUs, 4GB
- **Region**: AWS us-east-1 (N. Virginia)
- **Authentication**: Authenticated (HuggingFace 토큰 필요)
- **Autoscaling**: Scale-to-zero after 60 min (비용 절감)

### 남은 작업
- [ ] Railway ↔ Endpoint 인증 연동 디버깅 (Playground 테스트 후 진행)
- [ ] 실제 AI 분석 결과 확인

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
프론트엔드 (Vercel)          백엔드 (Railway)           HuggingFace Endpoints
     │                            │                              │
     │  fetch API                 │    Dedicated Endpoints       │
     └──────────────────────────→ FastAPI ─────────────────────→ │
                                   │                              │
                     ┌─────────────┼─────────────┐                │
                     │             │             │                │
                  /analyze    /voiceprint   /family-code          │
                     │             │             │                │
                     ▼             ▼             │                │
              ┌─────────────────────────────────────────┐         │
              │  HuggingFace Dedicated Endpoints        │         │
              │  (유료 - $0.134/hr)                     │◀────────┘
              ├─────────────────────────────────────────┤
              │ • Deepfake-audio-detection-V2 (딥페이크)│
              │ • wav2vec2-Speaker-Classification (화자)│
              └─────────────────────────────────────────┘
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
| GET | `/api/analyze/status` | AI 모델 상태 확인 |
| POST | `/api/voiceprint/register` | 성문 등록 |
| GET | `/api/voiceprint/list` | 성문 목록 |
| POST | `/api/family-code/register` | 가족 암호 등록 |
| POST | `/api/family-code/verify` | 가족 암호 검증 |
| GET | `/api/history` | 분석 이력 |

## AI 모델 현황 (2026-01-21 업데이트)

### 모델 변경 이력

| 항목 | 기존 (제안서) | 현재 (실제 배포) | 변경 이유 |
|-----|--------------|------------------|----------|
| 딥페이크 탐지 | Wav2Vec2 (ASR) | Deepfake-audio-detection-V2 | 실제 딥페이크 탐지용 fine-tuned 모델 |
| 화자 검증 | ECAPA-TDNN (SpeechBrain) | wav2vec2-Speaker-Classification | Inference Endpoint handler.py 호환성 |

### 기술 스택
- **딥페이크 탐지**: MelodyMachine/Deepfake-audio-detection-V2 (Wav2Vec2 기반)
- **화자 검증**: Saire2023/wav2vec2-base-finetuned-Speaker-Classification
- **프레임워크**: Transformers + PyTorch
- **인프라**: HuggingFace Dedicated Inference Endpoints (CPU)

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

### Backend (Railway)
- `HUGGINGFACE_API_TOKEN` - HuggingFace API 토큰 (필수, 설정 완료)
- `backend/config.py`에서 설정 관리
- `.env` 파일 지원

## 대회 제출 체크리스트

- [x] HuggingFace $20 크레딧 충전
- [x] Dedicated Inference Endpoints 생성 (딥페이크 + 화자)
- [x] 백엔드 Endpoint URL 연동 코드 작성
- [ ] Endpoint 인증 디버깅 (Playground 테스트)
- [ ] 실제 AI 분석 테스트
- [ ] MVP 제안서 PDF 작성 (양식에 맞게)
- [ ] 시연 영상 제작 (5분 이내, 유튜브 업로드)
- [ ] 데모 웹 링크 확인
- [ ] 코드 공유 페이지에 '비공개'로 업로드

**마감: 2026.02.11 오전 10:00**

---

*마지막 업데이트: 2026-01-21*
