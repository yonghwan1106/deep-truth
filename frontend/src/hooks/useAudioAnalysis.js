/**
 * 음성 분석 커스텀 훅
 * 음성 파일 분석 로직을 캡슐화
 */

import { useState, useCallback } from 'react'
import { analysisAPI } from '../services/api'

/**
 * 음성 분석 훅
 * @returns {Object} 분석 관련 상태 및 함수
 */
export function useAudioAnalysis() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  /**
   * 파일 선택 처리
   */
  const selectFile = useCallback((selectedFile) => {
    if (selectedFile) {
      // 파일 유효성 검사
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/ogg', 'audio/webm']
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!validTypes.includes(selectedFile.type)) {
        setError('지원하지 않는 오디오 형식입니다. MP3, WAV, M4A, OGG를 사용해주세요.')
        return
      }

      if (selectedFile.size > maxSize) {
        setError('파일 크기는 10MB 이하여야 합니다.')
        return
      }

      setFile(selectedFile)
      setResult(null)
      setError(null)
    }
  }, [])

  /**
   * 분석 실행
   */
  const analyze = useCallback(async () => {
    if (!file) {
      setError('분석할 파일을 선택해주세요.')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      // 실제 API 호출 (프로토타입에서는 목업 사용)
      // const response = await analysisAPI.analyzeAudio(file)

      // 프로토타입용 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1500))

      // 목업 결과 생성
      const isDeepfake = Math.random() > 0.5
      const deepfakeProb = isDeepfake
        ? Math.round(70 + Math.random() * 25)
        : Math.round(5 + Math.random() * 25)
      const voiceprintMatch = isDeepfake
        ? Math.round(5 + Math.random() * 20)
        : Math.round(70 + Math.random() * 25)

      const response = {
        deepfake_probability: deepfakeProb,
        voiceprint_match: voiceprintMatch,
        matched_person: '아들 (민준)',
        risk_level: deepfakeProb > 60 || voiceprintMatch < 40 ? 'high' : 'low',
        recommendations: deepfakeProb > 60 ? [
          '본인에게 영상통화로 직접 확인하세요',
          '경찰청 112에 신고하세요',
          '절대 송금하지 마세요',
        ] : [
          '정상적인 음성으로 판단됩니다',
          '그래도 중요한 결정 전에는 직접 확인을 권장합니다',
        ],
        audio_duration: Math.round((file.size / 32000) * 10) / 10,
        analysis_time: Math.round((2 + Math.random()) * 10) / 10,
        analysis_details: {
          spectral_anomaly: Math.round(isDeepfake ? 75 + Math.random() * 20 : 10 + Math.random() * 20),
          pitch_variation: Math.round(isDeepfake ? 60 + Math.random() * 25 : 15 + Math.random() * 20),
          temporal_consistency: Math.round(isDeepfake ? 50 + Math.random() * 30 : 20 + Math.random() * 25),
        },
      }

      // 결과 변환
      setResult({
        deepfakeProbability: response.deepfake_probability,
        voiceprintMatch: response.voiceprint_match,
        matchedPerson: response.matched_person,
        riskLevel: response.risk_level,
        recommendations: response.recommendations,
        audioDuration: response.audio_duration,
        analysisTime: response.analysis_time,
        analysisDetails: {
          spectralAnomaly: response.analysis_details.spectral_anomaly,
          pitchVariation: response.analysis_details.pitch_variation,
          temporalConsistency: response.analysis_details.temporal_consistency,
        },
      })
    } catch (err) {
      setError(err.message || '분석 중 오류가 발생했습니다.')
    } finally {
      setAnalyzing(false)
    }
  }, [file])

  /**
   * 초기화
   */
  const reset = useCallback(() => {
    setFile(null)
    setResult(null)
    setError(null)
  }, [])

  return {
    file,
    analyzing,
    result,
    error,
    selectFile,
    analyze,
    reset,
  }
}

export default useAudioAnalysis
