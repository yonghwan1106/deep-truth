# Deep Truth (딥 트루스)

**AI 딥페이크 음성을 탐지하고 가족 성문(Voiceprint)과 대조하여 진위를 검증하는 음성 분석 서비스**

> 피싱·스캠 예방을 위한 서비스 개발 경진대회 (데이콘) 출품작

## 배포 URL

- **프론트엔드**: https://deep-truth.vercel.app
- **백엔드 API**: https://deep-truth-production.up.railway.app
- **API 문서**: https://deep-truth-production.up.railway.app/docs

## 서비스 소개

Deep Truth는 딥페이크 음성 탐지와 가족 성문 대조라는 이중 검증 체계를 통해, 비동기 음성 메시지 사기에 특화된 예방 서비스입니다.

> **현재 상태**: HuggingFace Dedicated Inference Endpoints 연동 중

### 핵심 기능

- **딥페이크 탐지**: Wav2Vec2 기반 AI 합성 음성 여부 판별
- **성문 등록**: 가족 음성 샘플 녹음 및 특징 벡터 추출
- **성문 대조**: 수신 음성과 등록 성문 간 유사도 분석
- **가족 암호 검증**: 사전 약속된 암호 문구로 본인 확인
- **결과 대시보드**: 분석 결과 시각화 (위험도 게이지, 상세 리포트)

## 기술 스택

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router
- Recharts (차트)
- 배포: Vercel

### Backend
- FastAPI (Python 3.11)
- NumPy (음성 처리)
- aiohttp (비동기 HTTP)
- 배포: Railway

### AI 모델 (HuggingFace Dedicated Endpoints)

| 용도 | 모델 | 아키텍처 |
|-----|------|---------|
| 딥페이크 탐지 | MelodyMachine/Deepfake-audio-detection-V2 | Wav2Vec2 |
| 화자 검증 | Saire2023/wav2vec2-base-finetuned-Speaker-Classification | Wav2Vec2 |

## 프로젝트 구조

```
제안2.딥트루스/
├── frontend/                    # React 프론트엔드
│   ├── src/
│   │   ├── components/         # 재사용 컴포넌트
│   │   ├── pages/              # 페이지 컴포넌트
│   │   ├── hooks/              # 커스텀 훅
│   │   └── services/           # API 통신
│   └── public/
│
├── backend/                     # FastAPI 백엔드
│   ├── routers/                # API 라우터
│   ├── models/                 # AI 모델 래퍼
│   ├── utils/                  # 유틸리티
│   └── data/                   # 목업 데이터
│
└── docs/                        # 문서
    ├── MVP_제안서.html         # MVP 제안서
    ├── MVP_제안서.md           # MVP 제안서 (Markdown)
    └── 본선_QA_스크립트.md     # 본선 Q&A 대비
```

## 설치 및 실행

### Backend 실행

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/analyze` | 음성 파일 분석 |
| GET | `/api/analyze/status` | AI 모델 상태 확인 |
| POST | `/api/voiceprint/register` | 성문 등록 |
| POST | `/api/voiceprint/verify` | 성문 대조 |
| GET | `/api/voiceprint/list` | 등록된 성문 목록 |
| POST | `/api/family-code/register` | 가족 암호 등록 |
| POST | `/api/family-code/verify` | 가족 암호 검증 |
| GET | `/api/history` | 분석 이력 조회 |

## 환경 변수

### Backend (Railway)
```
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxx
```

### Frontend
```
VITE_API_URL=https://deep-truth-production.up.railway.app/api
```

## 팀 정보

- **팀명**: 딥트루스
- **팀장**: 박용환
- **팀원**: 김현실

## 라이선스

MIT License

---

🤖 Generated with Claude Code
