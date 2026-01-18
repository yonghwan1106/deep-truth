import { useState } from 'react'
import { Upload, AlertTriangle, CheckCircle, XCircle, Loader2, FileAudio, Shield, Fingerprint, Radio } from 'lucide-react'

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
    await new Promise(resolve => setTimeout(resolve, 3000))

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
      ],
      analysisDetails: {
        spectralAnomaly: 92,
        pitchVariation: 78,
        temporalConsistency: 65
      }
    })

    setAnalyzing(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-cyber-500/10 border border-cyber-500/30 text-cyber-400 px-3 py-1.5 rounded-full text-xs font-mono mb-4">
          <Radio className="w-3 h-3 animate-pulse" />
          VOICE ANALYSIS MODULE
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">음성 분석</h1>
        <p className="text-gray-400">의심스러운 음성 파일을 업로드하여 진위 여부를 분석합니다</p>
      </div>

      {/* Upload Area */}
      <div className="card-glow">
        <label className="block cursor-pointer">
          <div className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
            file
              ? 'border-cyber-500/50 bg-cyber-500/5'
              : 'border-dark-600 hover:border-cyber-500/50 hover:bg-dark-700/30'
          }`}>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-cyber-500/20 rounded-2xl flex items-center justify-center mb-4 border border-cyber-500/30 glow-cyber">
                  <FileAudio className="w-10 h-10 text-cyber-400" />
                </div>
                <p className="text-lg font-semibold text-white mb-1">{file.name}</p>
                <p className="text-sm text-gray-500 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dark-600">
                  <Upload className="w-10 h-10 text-gray-500" />
                </div>
                <p className="text-lg text-gray-300 mb-2">음성 파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-sm text-gray-500 font-mono">MP3, WAV, M4A, OGG 지원 (최대 10MB)</p>
              </>
            )}
          </div>
        </label>

        <button
          onClick={handleAnalyze}
          disabled={!file || analyzing}
          className="w-full btn-cyber mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 py-4 text-lg"
        >
          {analyzing ? (
            <>
              <div className="waveform scale-75">
                <span /><span /><span /><span /><span />
              </div>
              <span>AI 분석 중...</span>
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              분석 시작
            </>
          )}
        </button>
      </div>

      {/* Analyzing State */}
      {analyzing && (
        <div className="card-dark scan-line">
          <div className="flex items-center justify-center gap-4 py-8">
            <Loader2 className="w-8 h-8 text-cyber-400 animate-spin" />
            <div>
              <p className="text-white font-semibold">음성 파일 분석 중...</p>
              <p className="text-sm text-gray-500 font-mono">딥페이크 탐지 및 성문 대조 진행 중</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Risk Alert */}
          <div className={`card-dark relative overflow-hidden ${
            result.riskLevel === 'high'
              ? 'border-danger-500/50 glow-danger'
              : 'border-safe-500/50 glow-safe'
          }`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${
              result.riskLevel === 'high'
                ? 'bg-gradient-to-r from-danger-600 via-danger-400 to-danger-600'
                : 'bg-gradient-to-r from-safe-600 via-safe-400 to-safe-600'
            }`} />

            <div className="flex items-center gap-4">
              {result.riskLevel === 'high' ? (
                <div className="w-16 h-16 bg-danger-500/20 rounded-2xl flex items-center justify-center border border-danger-500/30">
                  <XCircle className="w-8 h-8 text-danger-400" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-safe-500/20 rounded-2xl flex items-center justify-center border border-safe-500/30">
                  <CheckCircle className="w-8 h-8 text-safe-400" />
                </div>
              )}
              <div>
                <h3 className={`text-2xl font-bold ${
                  result.riskLevel === 'high' ? 'text-danger-400' : 'text-safe-400'
                }`}>
                  {result.riskLevel === 'high' ? '위조 음성 의심' : '정상 음성'}
                </h3>
                <p className="text-gray-400 font-mono text-sm">분석 완료 | {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="ml-auto">
                <span className={`${
                  result.riskLevel === 'high' ? 'badge-danger' : 'badge-safe'
                } text-sm`}>
                  {result.riskLevel === 'high' ? 'HIGH RISK' : 'SAFE'}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Deepfake Probability */}
            <div className="card-dark">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-danger-500/20 rounded-xl flex items-center justify-center border border-danger-500/30">
                    <AlertTriangle className="w-5 h-5 text-danger-400" />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400">딥페이크 확률</h4>
                    <p className="text-xs text-gray-600 font-mono">DEEPFAKE PROBABILITY</p>
                  </div>
                </div>
                <span className="badge-danger">HIGH</span>
              </div>

              <div className="flex items-end gap-3 mb-3">
                <span className="text-5xl font-bold text-danger-400">{result.deepfakeProbability}</span>
                <span className="text-2xl text-danger-500 mb-1">%</span>
              </div>

              <div className="progress-bar progress-bar-danger">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${result.deepfakeProbability}%` }}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-dark-600/50 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500 font-mono">SPECTRAL</p>
                  <p className="text-sm text-danger-400 font-semibold">{result.analysisDetails.spectralAnomaly}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-mono">PITCH</p>
                  <p className="text-sm text-danger-400 font-semibold">{result.analysisDetails.pitchVariation}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-mono">TEMPORAL</p>
                  <p className="text-sm text-danger-400 font-semibold">{result.analysisDetails.temporalConsistency}%</p>
                </div>
              </div>
            </div>

            {/* Voiceprint Match */}
            <div className="card-dark">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyber-500/20 rounded-xl flex items-center justify-center border border-cyber-500/30">
                    <Fingerprint className="w-5 h-5 text-cyber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400">{result.matchedPerson} 성문 일치율</h4>
                    <p className="text-xs text-gray-600 font-mono">VOICEPRINT MATCH</p>
                  </div>
                </div>
                <span className="badge-warning">LOW</span>
              </div>

              <div className="flex items-end gap-3 mb-3">
                <span className="text-5xl font-bold text-cyber-400">{result.voiceprintMatch}</span>
                <span className="text-2xl text-cyber-500 mb-1">%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${result.voiceprintMatch}%` }}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-dark-600/50">
                <p className="text-sm text-gray-400">
                  등록된 <span className="text-cyber-400 font-semibold">{result.matchedPerson}</span>의
                  성문과 비교한 결과, 일치율이 매우 낮습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card-dark border-warning-500/30 bg-warning-500/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-warning-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-warning-500/30">
                <AlertTriangle className="w-6 h-6 text-warning-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-warning-400 text-lg mb-3">권장 조치</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                      <span className="w-6 h-6 bg-warning-500/20 rounded-full flex items-center justify-center text-xs text-warning-400 font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
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
