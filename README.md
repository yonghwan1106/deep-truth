# Deep Truth (딥 트루스)

**AI 딥페이크 음성을 탐지하고 가족 성문(Voiceprint)과 대조하여 진위를 검증하는 음성 분석 서비스**

## 서비스 소개

Deep Truth는 딥페이크 음성 탐지와 가족 성문 대조라는 이중 검증 체계를 통해, 비동기 음성 메시지 사기에 특화된 예방 서비스입니다.

### 핵심 기능

- **딥페이크 탐지**: Wav2Vec2 기반 AI 합성 음성 여부 판별
- **성문 등록**: 가족 음성 샘플 녹음 및 특징 벡터 추출
- **성문 대조**: 수신 음성과 등록 성문 간 유사도 분석
- **가족 암호 검증**: 사전 약속된 암호 문구로 본인 확인
- **결과 대시보드**: 분석 결과 시각화 (위험도 게이지, 상세 리포트)

## 기술 스택

### Frontend
- React 18
- Tailwind CSS
- Vite
- React Router

### Backend
- FastAPI (Python)
- Wav2Vec2 (딥페이크 탐지)
- ECAPA-TDNN (화자 검증)
- librosa, torchaudio (음성 처리)

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
│   ├── models/                 # AI 모델
│   ├── utils/                  # 유틸리티
│   └── data/                   # 목업 데이터
│
└── docs/                        # 문서
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
| POST | `/api/voiceprint/register` | 성문 등록 |
| POST | `/api/voiceprint/verify` | 성문 대조 |
| GET | `/api/voiceprint/list` | 등록된 성문 목록 |
| POST | `/api/family-code/register` | 가족 암호 등록 |
| POST | `/api/family-code/verify` | 가족 암호 검증 |
| GET | `/api/history` | 분석 이력 조회 |

## 라이선스

MIT License

---

🤖 Generated with Claude Code
