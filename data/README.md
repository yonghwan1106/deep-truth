# Deep Truth 목업 데이터

프로토타입 시연용 목업 데이터 설명입니다.

## 폴더 구조

```
data/
├── real_voices/       # 실제 사람 음성 샘플
├── fake_voices/       # AI 생성 딥페이크 음성 샘플
└── voiceprints/       # 등록된 성문 데이터
```

## 샘플 데이터 설명

### real_voices/
실제 사람이 녹음한 음성 샘플입니다.
- 프로토타입에서는 공개 데이터셋(VoxCeleb, LibriSpeech 등)에서 추출한 샘플을 사용합니다.
- 실제 배포 시에는 사용자가 직접 등록한 가족 음성을 저장합니다.

### fake_voices/
AI로 생성된 딥페이크 음성 샘플입니다.
- ASVspoof 데이터셋의 스푸핑 음성
- TTS(Text-to-Speech) 합성 음성
- Voice Conversion(음성 변환) 샘플

### voiceprints/
등록된 가족 성문(Voiceprint) 데이터입니다.
- ECAPA-TDNN 모델로 추출한 192차원 임베딩 벡터
- JSON 형식으로 저장 (암호화 권장)

## 프로토타입 모드

프로토타입에서는 실제 오디오 파일 대신 목업 결과를 반환합니다:

1. **딥페이크 탐지**: 랜덤 확률값 생성 (파일명에 "fake"가 포함되면 높은 확률)
2. **성문 대조**: 랜덤 유사도값 생성 (사전 등록된 목업 멤버와 비교)

## 실제 데이터셋 참고

실제 모델 학습/평가에 사용할 수 있는 공개 데이터셋:

| 데이터셋 | 용도 | 링크 |
|----------|------|------|
| ASVspoof 2019/2021 | 딥페이크 탐지 | https://www.asvspoof.org/ |
| VoxCeleb1/2 | 화자 검증 | https://www.robots.ox.ac.uk/~vgg/data/voxceleb/ |
| DEEP-VOICE | 음성 복제 탐지 | https://github.com/dessa-oss/DEEP-VOICE |
| LibriSpeech | 음성 인식 | https://www.openslr.org/12 |

## 보안 참고사항

- 실제 서비스에서는 모든 음성 데이터를 암호화하여 저장합니다.
- 성문 임베딩은 복호화가 불가능한 형태로 저장하여 원본 음성 재구성을 방지합니다.
- GDPR/개인정보보호법 준수를 위해 사용자 동의 후에만 데이터를 수집합니다.
