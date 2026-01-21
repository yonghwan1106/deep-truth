# Deep Truth (딥 트루스) - 개발 로드맵

## 프로젝트 개요
- **서비스명**: Deep Truth (딥 트루스)
- **목적**: AI 딥페이크 음성 탐지 + 가족 성문 대조 이중 검증 서비스
- **공모전**: 피싱·스캠 예방을 위한 서비스 개발 경진대회 (데이콘)
- **마감일**: 2026.02.11 오전 10:00
- **상금**: 대상 500만원, 최우수상 300만원, 우수상 200만원

---

## 현재 배포 상태 (2026-01-21 기준)

### 프론트엔드 ✅
- **URL**: https://deep-truth.vercel.app
- **플랫폼**: Vercel
- **기술스택**: React + Vite + Tailwind CSS
- **상태**: 완전 작동

### 백엔드 ✅
- **URL**: https://deep-truth-production.up.railway.app
- **API Docs**: https://deep-truth-production.up.railway.app/docs
- **플랫폼**: Railway (Hobby Plan - $5/월)
- **기술스택**: FastAPI + Python 3.11
- **상태**: ✅ HuggingFace Endpoints 연동 완료 (실제 AI 분석 작동)

### HuggingFace Inference Endpoints ✅
- **크레딧**: $20 충전 완료
- **딥페이크 탐지**: `https://d5lc45iws9kwmc8t.us-east-1.aws.endpoints.huggingface.cloud` ✅ 작동
- **화자 검증**: `https://t4irvwao5mfphl46.us-east-1.aws.endpoints.huggingface.cloud` ✅ 작동 (Custom ECAPA-TDNN)
- **상태**: ✅ 완전 작동 (API 인증 완료)

### GitHub 저장소
- **URL**: https://github.com/yonghwan1106/deep-truth
- **브랜치**: master

---

## 🎯 대회 제출 체크리스트

### 필수 제출물
- [ ] **MVP 제안서 (PDF)** - 양식에 맞게 작성, 20MB 이하
- [ ] **시연 영상** - 5분 이내, 유튜브 업로드
- [x] **데모 웹 링크** - https://deep-truth.vercel.app

### MVP 제안서 필수 항목 (7개)
- [x] Summary
- [x] 문제 정의 (Problem Definition)
- [x] 제안 솔루션 개요 (Solution Overview)
- [x] 주요 기능 정의 (Key Features)
- [x] 데이터 및 기술 활용 (Data & Tech)
- [x] 사용자 시나리오/유즈케이스 (User Scenario)
- [x] 기대 효과 및 향후 확장성 (Expected Impact)

### 기술 구현
- [x] **HuggingFace Dedicated Endpoints 생성** (딥페이크 탐지)
- [x] **HuggingFace Dedicated Endpoints 생성** (화자 검증 - Custom ECAPA-TDNN)
- [x] **백엔드 Endpoint URL 연동 코드**
- [x] **Endpoint 인증 디버깅 완료**
- [x] **실제 음성 분석 테스트 완료** (딥페이크 + 화자 검증 모두 API 모드)

---

## 완료된 작업 ✅

### 1. 프론트엔드
- [x] React 프로젝트 구조 설정
- [x] Cyber Security Noir 테마 UI 디자인
- [x] 홈페이지 (서비스 소개)
- [x] 음성 분석 페이지 (파일 업로드 + 결과 표시)
- [x] 성문 등록 페이지
- [x] 가족 암호 관리 페이지
- [x] 분석 이력 페이지
- [x] 반응형 디자인
- [x] Vercel 배포

### 2. 백엔드
- [x] FastAPI 프로젝트 구조 설정
- [x] 분석 API 엔드포인트 (`/api/analyze/`)
- [x] 성문 API 엔드포인트 (`/api/voiceprint/`)
- [x] 가족 암호 API 엔드포인트 (`/api/family-code/`)
- [x] 분석 이력 API 엔드포인트 (`/api/history/`)
- [x] CORS 설정
- [x] Railway 배포

### 3. 인프라
- [x] GitHub 저장소 연동
- [x] Vercel 자동 배포 (프론트엔드)
- [x] Railway 자동 배포 (백엔드)
- [x] 공개 도메인 설정

### 4. AI 인프라 (2026-01-21 완료)
- [x] HuggingFace $20 크레딧 충전
- [x] 딥페이크 탐지 Endpoint 생성 (MelodyMachine/Deepfake-audio-detection-V2)
- [x] 화자 검증 Endpoint 생성 (Saire2023/wav2vec2-base-finetuned-Speaker-Classification)
- [x] 백엔드 코드에 Endpoint URL 연동

---

## 🚀 AI 모델 현황

### 모델 선정 과정 (2026-01-21)

#### 딥페이크 탐지
| 후보 | 결과 | 이유 |
|-----|------|------|
| facebook/wav2vec2-large-960h | ❌ | ASR 모델 (딥페이크 탐지 아님) |
| **MelodyMachine/Deepfake-audio-detection-V2** | ✅ 선정 | Wav2Vec2 기반 딥페이크 탐지 fine-tuned |

#### 화자 검증
| 후보 | 결과 | 이유 |
|-----|------|------|
| speechbrain/spkrec-ecapa-voxceleb | ❌ → ✅ | handler.py 없음 → **Custom handler.py 작성하여 해결** |
| nvidia/speakerverification_en_titanet_large | ❌ | NeMo 프레임워크 (Transformers 호환 안됨) |
| microsoft/wavlm-base-plus-sv | ❌ | handler.py 없음 |
| Saire2023/wav2vec2-base-finetuned-Speaker-Classification | ❌ | 분류 결과 반환 (임베딩 아님) |
| **sanoramyun8/speaker-embedding-endpoint** | ✅ 최종 선정 | Custom ECAPA-TDNN, 192차원 임베딩 |

### 최종 기술 스택

| 용도 | 모델 | 아키텍처 | 출력 |
|-----|------|---------|------|
| 딥페이크 탐지 | MelodyMachine/Deepfake-audio-detection-V2 | Wav2Vec2 | 분류 (real/fake) |
| 화자 검증 | sanoramyun8/speaker-embedding-endpoint | ECAPA-TDNN (SpeechBrain) | 192차원 임베딩 |

### 제안서 대비 변경사항

| 항목 | 제안서 | 실제 배포 | 호환성 |
|-----|--------|----------|--------|
| 딥페이크 탐지 | Wav2Vec2 기반 | Wav2Vec2 기반 (fine-tuned) | ✅ 일치 |
| 화자 검증 | ECAPA-TDNN | **ECAPA-TDNN (Custom Endpoint)** | ✅ 일치 (제안서와 동일 모델)

---

## 💰 비용

### 현재 비용 (2026-01-21)
| 항목 | 비용 |
|------|------|
| Vercel | 무료 |
| Railway Hobby | $5/월 |
| HuggingFace 크레딧 | $20 (일회성) |
| HuggingFace Endpoints | $0.134/hr (사용시만) |
| **총 비용** | **$5/월 + 사용량** |

### 크레딧 사용 예상
- $20 ÷ $0.134/hr = **~149시간**
- 대회 마감까지 충분한 테스트 가능

---

## 📅 개발 일정

```
2026-01-21 (완료)
    │
    ├─ [완료] HuggingFace $20 크레딧 충전
    ├─ [완료] Dedicated Endpoints 생성 (딥페이크 + 화자)
    ├─ [완료] 백엔드 Endpoint URL 연동 코드
    ├─ [완료] Custom ECAPA-TDNN Endpoint 생성
    ├─ [완료] Endpoint 인증 디버깅
    ├─ [완료] 실제 AI 분석 테스트
    │
    ▼
[다음 작업] 시연 영상 제작 (5분 이내)
    │
    ▼
[다음 작업] 코드 공유 페이지 업로드
    │
    ▼
[필수] 최종 테스트 + 제출
    │
    ▼
2026-02-11 (마감)
```

**여유 시간: 약 3주**

---

## 다음 작업 (TODO)

1. **시연 영상 제작** - 5분 이내, 유튜브 업로드
2. **코드 공유 페이지 업로드** - 비공개로 설정

---

## 업데이트 이력

| 날짜 | 작업 내용 |
|------|----------|
| 2026-01-18 | Railway 백엔드 배포 완료, Vercel 프론트엔드 배포 완료 |
| 2026-01-18 | 목업 모드로 전체 플로우 작동 확인 |
| 2026-01-18 | HuggingFace API 연동 코드 작성 (백엔드) |
| 2026-01-18 | ⚠️ HuggingFace 무료 Inference API 종료 확인 |
| 2026-01-20 | MVP 제안서 작성 (HTML/MD), 본선 Q&A 스크립트 작성 |
| 2026-01-20 | AI 모델 로드맵 추가 (AASIST, SASV) |
| 2026-01-21 | HuggingFace $20 크레딧 충전 |
| 2026-01-21 | Dedicated Inference Endpoints 생성 (딥페이크) |
| 2026-01-21 | Content-Type 헤더 추가 (deepfake_detector.py, speaker_verifier.py) |
| 2026-01-21 | 화자 분류 모델 → Custom ECAPA-TDNN 임베딩 Endpoint로 변경 |
| **2026-01-21** | **Custom handler.py 작성 (sanoramyun8/speaker-embedding-endpoint)** |
| **2026-01-21** | **새 HuggingFace Write 토큰 생성** |
| **2026-01-21** | **Railway 환경변수 업데이트 (CLI 직접 설정)** |
| **2026-01-21** | **✅ 딥페이크 탐지 + 화자 검증 모두 API 모드 작동 확인** |

---

*마감일: 2026.02.11 오전 10:00*
