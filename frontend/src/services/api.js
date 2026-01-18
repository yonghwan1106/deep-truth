/**
 * Deep Truth API Service
 * 백엔드 API 통신 모듈
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://deep-truth-production.up.railway.app/api'

/**
 * API 요청 헬퍼 함수
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new Error(error.detail || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

/**
 * 음성 분석 API
 */
export const analysisAPI = {
  /**
   * 음성 파일 분석 (딥페이크 탐지 + 성문 대조)
   * @param {File} audioFile - 분석할 음성 파일
   * @returns {Promise<Object>} 분석 결과
   */
  analyzeAudio: async (audioFile) => {
    const formData = new FormData()
    formData.append('file', audioFile)

    return fetchAPI('/analyze/', {
      method: 'POST',
      body: formData,
    })
  },

  /**
   * 빠른 딥페이크 분석만 수행
   * @param {File} audioFile - 분석할 음성 파일
   * @returns {Promise<Object>} 딥페이크 확률
   */
  quickAnalysis: async (audioFile) => {
    const formData = new FormData()
    formData.append('file', audioFile)

    return fetchAPI('/analyze/quick', {
      method: 'POST',
      body: formData,
    })
  },
}

/**
 * 성문(Voiceprint) API
 */
export const voiceprintAPI = {
  /**
   * 성문 등록
   * @param {Object} data - 등록 정보
   * @param {string} data.name - 이름
   * @param {string} data.relation - 관계
   * @param {File[]} data.audioFiles - 음성 샘플 파일들
   * @returns {Promise<Object>} 등록 결과
   */
  register: async ({ name, relation, audioFiles }) => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('relation', relation)
    audioFiles.forEach((file, index) => {
      formData.append(`audio_${index}`, file)
    })

    return fetchAPI('/voiceprint/register', {
      method: 'POST',
      body: formData,
    })
  },

  /**
   * 등록된 성문 목록 조회
   * @returns {Promise<Array>} 성문 목록
   */
  list: async () => {
    return fetchAPI('/voiceprint/list')
  },

  /**
   * 성문 삭제
   * @param {string} memberId - 멤버 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  delete: async (memberId) => {
    return fetchAPI(`/voiceprint/${memberId}`, {
      method: 'DELETE',
    })
  },

  /**
   * 성문 검증
   * @param {File} audioFile - 검증할 음성 파일
   * @param {string} memberId - 특정 멤버와 비교 (선택)
   * @returns {Promise<Object>} 검증 결과
   */
  verify: async (audioFile, memberId = null) => {
    const formData = new FormData()
    formData.append('file', audioFile)
    if (memberId) {
      formData.append('member_id', memberId)
    }

    return fetchAPI('/voiceprint/verify', {
      method: 'POST',
      body: formData,
    })
  },
}

/**
 * 가족 암호 API
 */
export const familyCodeAPI = {
  /**
   * 가족 암호 등록
   * @param {Object} data - 암호 정보
   * @param {string} data.memberId - 멤버 ID
   * @param {string} data.question - 질문
   * @param {string} data.answer - 답변
   * @returns {Promise<Object>} 등록 결과
   */
  register: async ({ memberId, question, answer }) => {
    return fetchAPI('/family-code/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id: memberId, question, answer }),
    })
  },

  /**
   * 가족 암호 검증
   * @param {string} memberId - 멤버 ID
   * @param {string} answer - 제공된 답변
   * @returns {Promise<Object>} 검증 결과
   */
  verify: async (memberId, answer) => {
    return fetchAPI('/family-code/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id: memberId, answer }),
    })
  },

  /**
   * 등록된 가족 암호 목록 조회
   * @returns {Promise<Array>} 암호 목록 (질문만 표시)
   */
  list: async () => {
    return fetchAPI('/family-code/list')
  },

  /**
   * 가족 암호 삭제
   * @param {string} memberId - 멤버 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  delete: async (memberId) => {
    return fetchAPI(`/family-code/${memberId}`, {
      method: 'DELETE',
    })
  },
}

/**
 * 분석 이력 API
 */
export const historyAPI = {
  /**
   * 분석 이력 조회
   * @param {Object} params - 조회 파라미터
   * @param {number} params.page - 페이지 번호
   * @param {number} params.limit - 페이지당 항목 수
   * @returns {Promise<Object>} 이력 목록
   */
  list: async ({ page = 1, limit = 20 } = {}) => {
    return fetchAPI(`/history?page=${page}&limit=${limit}`)
  },

  /**
   * 분석 이력 상세 조회
   * @param {string} analysisId - 분석 ID
   * @returns {Promise<Object>} 상세 정보
   */
  get: async (analysisId) => {
    return fetchAPI(`/history/${analysisId}`)
  },

  /**
   * 분석 이력 통계
   * @returns {Promise<Object>} 통계 정보
   */
  stats: async () => {
    return fetchAPI('/history/stats')
  },
}

/**
 * 헬스체크
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`)
    return response.ok
  } catch {
    return false
  }
}

export default {
  analysis: analysisAPI,
  voiceprint: voiceprintAPI,
  familyCode: familyCodeAPI,
  history: historyAPI,
  healthCheck,
}
