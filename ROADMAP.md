# Deep Truth (딥 트루스) - 개발 로드맵

## 프로젝트 개요
- **서비스명**: Deep Truth (딥 트루스)
- **목적**: AI 딥페이크 음성 탐지 + 가족 성문 대조 이중 검증 서비스
- **공모전**: 피싱·스캠 예방을 위한 서비스 개발 경진대회 (데이콘)
- **마감일**: 2026.02.11 오전 10:00
- **상금**: 대상 500만원, 최우수상 300만원, 우수상 200만원

---

## 현재 배포 상태 (2026-01-18 기준)

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
- **상태**: 목업 모드 → **HuggingFace API로 전환 예정**

### GitHub 저장소
- **URL**: https://github.com/yonghwan1106/deep-truth
- **브랜치**: master

---

## 🎯 대회 제출 체크리스트

### 필수 제출물
- [ ] **MVP 제안서 (PDF)** - 양식에 맞게 작성, 20MB 이하
- [ ] **시연 영상** - 5분 이내, 유튜브 업로드
- [ ] **데모 웹 링크** - https://deep-truth.vercel.app

### MVP 제안서 필수 항목 (7개)
- [ ] Summary
- [ ] 문제 정의 (Problem Definition)
- [ ] 제안 솔루션 개요 (Solution Overview)
- [ ] 주요 기능 정의 (Key Features)
- [ ] 데이터 및 기술 활용 (Data & Tech)
- [ ] 사용자 시나리오/유즈케이스 (User Scenario)
- [ ] 기대 효과 및 향후 확장성 (Expected Impact)

### 기술 구현
- [ ] **HuggingFace Inference API 연동** (딥페이크 탐지)
- [ ] **HuggingFace Inference API 연동** (화자 검증)
- [ ] **실제 음성 분석 테스트**

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

---

## 🚀 AI 기능 구현 계획 (HuggingFace Inference API)

### 왜 HuggingFace Inference API인가?

| 방식 | 비용 | Railway 업그레이드 | 난이도 |
|------|------|-------------------|--------|
| ~~직접 모델 로드~~ | $20-50/월 | 필요 (2GB+ 메모리) | 어려움 |
| **HuggingFace API** | **무료** | **불필요** | **쉬움** |

### 구현 단계

#### Step 1: HuggingFace 설정 (30분)
- [ ] HuggingFace 계정 생성/로그인
- [ ] API 토큰 발급 (https://huggingface.co/settings/tokens)
- [ ] Railway 환경변수에 `HUGGINGFACE_API_TOKEN` 추가

#### Step 2: 딥페이크 탐지 구현 (2-3시간)
- [ ] `requirements.txt`에 `aiohttp` 추가
- [ ] `models/deepfake_detector.py` 수정
- [ ] HuggingFace API 호출 로직 구현
- [ ] 응답 파싱 및 확률 계산
- [ ] 테스트

**사용 모델**: `facebook/wav2vec2-base` 또는 ASVspoof 전용 모델

#### Step 3: 화자 검증 구현 (2-3시간)
- [ ] `models/speaker_verifier.py` 수정
- [ ] 음성 임베딩 추출 API 호출
- [ ] 코사인 유사도 계산
- [ ] 등록된 성문과 비교 로직
- [ ] 테스트

**사용 모델**: `speechbrain/spkrec-ecapa-voxceleb`

#### Step 4: 통합 테스트 (1-2시간)
- [ ] 실제 음성 파일로 전체 플로우 테스트
- [ ] 딥페이크 샘플 vs 실제 음성 테스트
- [ ] 등록된 화자 vs 다른 화자 테스트
- [ ] 에러 핸들링 확인

### 코드 수정 가이드

#### requirements.txt 추가
```
aiohttp==3.9.1
```

#### models/deepfake_detector.py
```python
import aiohttp
import os
from typing import Tuple
import numpy as np

HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")
DEEPFAKE_MODEL = "https://api-inference.huggingface.co/models/facebook/wav2vec2-base"

class DeepfakeDetector:
    def __init__(self):
        self.api_url = DEEPFAKE_MODEL
        self.headers = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}

    async def analyze(self, audio_bytes: bytes) -> Tuple[float, dict]:
        """
        음성 데이터를 분석하여 딥페이크 확률 반환
        Returns: (딥페이크 확률 0-100, 상세 결과)
        """
        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.api_url,
                headers=self.headers,
                data=audio_bytes
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    # 결과 파싱 로직
                    probability = self._parse_result(result)
                    return probability, result
                else:
                    # 에러 시 목업 반환
                    return 50.0, {"error": "API call failed"}

    def _parse_result(self, result: dict) -> float:
        # HuggingFace 응답을 딥페이크 확률로 변환
        # 모델에 따라 파싱 로직 조정 필요
        pass
```

#### models/speaker_verifier.py
```python
import aiohttp
import os
import numpy as np
from typing import List, Tuple

HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")
SPEAKER_MODEL = "https://api-inference.huggingface.co/models/speechbrain/spkrec-ecapa-voxceleb"

class SpeakerVerifier:
    def __init__(self):
        self.api_url = SPEAKER_MODEL
        self.headers = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}
        self.registered_embeddings = {}  # member_id -> embedding

    async def get_embedding(self, audio_bytes: bytes) -> np.ndarray:
        """음성에서 화자 임베딩 추출"""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.api_url,
                headers=self.headers,
                data=audio_bytes
            ) as response:
                result = await response.json()
                return np.array(result)

    async def verify(self, audio_bytes: bytes, member_id: str) -> Tuple[float, str]:
        """
        음성이 등록된 화자와 일치하는지 검증
        Returns: (일치율 0-100, 매칭된 멤버 이름)
        """
        embedding = await self.get_embedding(audio_bytes)

        if member_id in self.registered_embeddings:
            registered = self.registered_embeddings[member_id]
            similarity = self._cosine_similarity(embedding, registered)
            return similarity * 100, member_id

        return 0.0, "Unknown"

    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

### HuggingFace Inference API 제한

| 항목 | 무료 티어 |
|------|----------|
| 월 요청 수 | 30,000 |
| Rate Limit | ~30 요청/분 |
| 응답 시간 | 1-5초 |
| 모델 | 대부분 사용 가능 |

**대회 시연에 충분한 용량입니다.**

---

## 📅 개발 일정 (권장)

```
2026-01-18 (오늘)
    │
    ▼
[1일차] HuggingFace API 연동 + 딥페이크 탐지
    │
    ▼
[2일차] 화자 검증 구현 + 통합 테스트
    │
    ▼
[3일차] MVP 제안서 PDF 작성
    │
    ▼
[4일차] 시연 영상 제작
    │
    ▼
[5일차] 최종 테스트 + 제출
    │
    ▼
2026-02-11 (마감)
```

**여유 시간: 약 3주** - 충분합니다!

---

## 💰 비용

| 항목 | 현재 | AI 기능 활성화 후 |
|------|------|------------------|
| Vercel | 무료 | 무료 |
| Railway | $5/월 | $5/월 (동일) |
| HuggingFace API | - | 무료 |
| **총 비용** | **$5/월** | **$5/월** |

**Railway 업그레이드 불필요!**

---

## 참고 자료

### HuggingFace 모델
- **딥페이크 탐지**: `facebook/wav2vec2-base`
- **화자 검증**: `speechbrain/spkrec-ecapa-voxceleb`
- **음성 인식**: `openai/whisper-base`

### 관련 문서
- [HuggingFace Inference API](https://huggingface.co/docs/api-inference)
- [Wav2Vec2 Documentation](https://huggingface.co/docs/transformers/model_doc/wav2vec2)
- [SpeechBrain](https://speechbrain.github.io/)

---

## 업데이트 이력

| 날짜 | 작업 내용 |
|------|----------|
| 2026-01-18 | Railway 백엔드 배포 완료, Vercel 프론트엔드 배포 완료 |
| 2026-01-18 | 목업 모드로 전체 플로우 작동 확인 |
| 2026-01-18 | **HuggingFace Inference API 방식으로 AI 구현 계획 수립** |

---

*마감일: 2026.02.11 오전 10:00 - 화이팅!* 🚀
