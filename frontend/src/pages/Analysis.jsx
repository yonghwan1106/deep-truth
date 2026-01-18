import { useState } from 'react'
import { Upload, AlertTriangle, CheckCircle, XCircle, Loader2, FileAudio } from 'lucide-react'

function Analysis() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setAnalyzing(true)

    // 시뮬레이션 (실제로는 API 호출)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 목업 결과
    setResult({
      deepfakeProbability: 87,
      voiceprintMatch: 12,
      matchedPerson: '아들 (민준)',
      riskLevel: 'high',
      recommendations: [
        '아들에게 영상통화로 직접 확인하세요',
        '경찰청 112에 신고하세요',
        '절대 송금하지 마세요'
      ]
    })

    setAnalyzing(false)
  }

  const getRiskColor = (level) => {
    switch(level) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-amber-600 bg-amber-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">음성 분석</h1>
        <p className="text-gray-600">의심스러운 음성 파일을 업로드하여 진위 여부를 분석합니다</p>
      </div>

      {/* Upload Area */}
      <div className="card">
        <label className="block">
          <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            file ? 'border-primary-300 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
          }`}>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileAudio className="w-8 h-8 text-primary-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">음성 파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-sm text-gray-400">MP3, WAV, M4A, OGG 지원</p>
              </>
            )}
          </div>
        </label>

        <button
          onClick={handleAnalyze}
          disabled={!file || analyzing}
          className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              분석 중...
            </>
          ) : (
            '분석 시작'
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Risk Alert */}
          <div className={`card ${result.riskLevel === 'high' ? 'border-red-200 bg-red-50' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              {result.riskLevel === 'high' ? (
                <XCircle className="w-8 h-8 text-red-600" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {result.riskLevel === 'high' ? '위조 음성 의심' : '정상 음성'}
                </h3>
                <p className="text-sm text-gray-600">분석이 완료되었습니다</p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Deepfake Probability */}
            <div className="card">
              <h4 className="text-sm font-medium text-gray-500 mb-2">딥페이크 확률</h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-red-600">{result.deepfakeProbability}%</span>
                <span className="text-sm text-gray-500 mb-1">HIGH</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all"
                  style={{ width: `${result.deepfakeProbability}%` }}
                />
              </div>
            </div>

            {/* Voiceprint Match */}
            <div className="card">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {result.matchedPerson} 성문 일치율
              </h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-blue-600">{result.voiceprintMatch}%</span>
                <span className="text-sm text-gray-500 mb-1">LOW</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${result.voiceprintMatch}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">권장 조치</h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-amber-700 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analysis
