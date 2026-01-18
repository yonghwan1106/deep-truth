/**
 * 분석 결과 대시보드 컴포넌트
 */

import { AlertTriangle, CheckCircle, XCircle, Fingerprint, Shield, Clock, FileAudio } from 'lucide-react'
import RiskGauge from './RiskGauge'

export function ResultDashboard({ result }) {
  if (!result) return null

  const isHighRisk = result.riskLevel === 'high' || result.riskLevel === 'critical'

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Risk Alert Banner */}
      <div className={`card-dark relative overflow-hidden ${
        isHighRisk
          ? 'border-danger-500/50 glow-danger'
          : 'border-safe-500/50 glow-safe'
      }`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${
          isHighRisk
            ? 'bg-gradient-to-r from-danger-600 via-danger-400 to-danger-600'
            : 'bg-gradient-to-r from-safe-600 via-safe-400 to-safe-600'
        }`} />

        <div className="flex items-center gap-4">
          {isHighRisk ? (
            <div className="w-16 h-16 bg-danger-500/20 rounded-2xl flex items-center justify-center border border-danger-500/30">
              <XCircle className="w-8 h-8 text-danger-400" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-safe-500/20 rounded-2xl flex items-center justify-center border border-safe-500/30">
              <CheckCircle className="w-8 h-8 text-safe-400" />
            </div>
          )}
          <div className="flex-1">
            <h3 className={`text-2xl font-bold ${
              isHighRisk ? 'text-danger-400' : 'text-safe-400'
            }`}>
              {isHighRisk ? '위조 음성 의심' : '정상 음성'}
            </h3>
            <p className="text-gray-400 font-mono text-sm">
              분석 완료 | {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div>
            <span className={`${
              isHighRisk ? 'badge-danger' : 'badge-safe'
            } text-sm`}>
              {isHighRisk ? 'HIGH RISK' : 'SAFE'}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Deepfake Probability */}
        <div className="card-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-danger-500/20 rounded-xl flex items-center justify-center border border-danger-500/30">
              <AlertTriangle className="w-5 h-5 text-danger-400" />
            </div>
            <div>
              <h4 className="text-sm text-gray-400">딥페이크 확률</h4>
              <p className="text-xs text-gray-600 font-mono">DEEPFAKE PROBABILITY</p>
            </div>
          </div>

          <RiskGauge
            value={result.deepfakeProbability}
            type={result.deepfakeProbability > 60 ? 'danger' : 'safe'}
          />

          {/* Analysis Details */}
          {result.analysisDetails && (
            <div className="mt-4 pt-4 border-t border-dark-600/50 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500 font-mono">SPECTRAL</p>
                <p className={`text-sm font-semibold ${
                  result.analysisDetails.spectralAnomaly > 50 ? 'text-danger-400' : 'text-safe-400'
                }`}>
                  {result.analysisDetails.spectralAnomaly}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-mono">PITCH</p>
                <p className={`text-sm font-semibold ${
                  result.analysisDetails.pitchVariation > 50 ? 'text-danger-400' : 'text-safe-400'
                }`}>
                  {result.analysisDetails.pitchVariation}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-mono">TEMPORAL</p>
                <p className={`text-sm font-semibold ${
                  result.analysisDetails.temporalConsistency > 50 ? 'text-danger-400' : 'text-safe-400'
                }`}>
                  {result.analysisDetails.temporalConsistency}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Voiceprint Match */}
        <div className="card-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyber-500/20 rounded-xl flex items-center justify-center border border-cyber-500/30">
              <Fingerprint className="w-5 h-5 text-cyber-400" />
            </div>
            <div>
              <h4 className="text-sm text-gray-400">
                {result.matchedPerson} 성문 일치율
              </h4>
              <p className="text-xs text-gray-600 font-mono">VOICEPRINT MATCH</p>
            </div>
          </div>

          <RiskGauge
            value={result.voiceprintMatch}
            type={result.voiceprintMatch < 40 ? 'danger' : 'safe'}
          />

          <div className="mt-4 pt-4 border-t border-dark-600/50">
            <p className="text-sm text-gray-400">
              {result.voiceprintMatch >= 70 ? (
                <>
                  등록된 <span className="text-cyber-400 font-semibold">{result.matchedPerson}</span>의
                  성문과 <span className="text-safe-400 font-semibold">높은 일치율</span>을 보입니다.
                </>
              ) : (
                <>
                  등록된 <span className="text-cyber-400 font-semibold">{result.matchedPerson}</span>의
                  성문과 <span className="text-danger-400 font-semibold">일치하지 않습니다</span>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-dark flex items-center gap-3">
          <FileAudio className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">오디오 길이</p>
            <p className="text-white font-mono">{result.audioDuration || '-'}초</p>
          </div>
        </div>
        <div className="card-dark flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">분석 시간</p>
            <p className="text-white font-mono">{result.analysisTime || '-'}초</p>
          </div>
        </div>
        <div className="card-dark flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">모델 버전</p>
            <p className="text-white font-mono">v1.0</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className={`card-dark ${
          isHighRisk
            ? 'border-warning-500/30 bg-warning-500/5'
            : 'border-cyber-500/30 bg-cyber-500/5'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              isHighRisk
                ? 'bg-warning-500/20 border-warning-500/30'
                : 'bg-cyber-500/20 border-cyber-500/30'
            }`}>
              {isHighRisk ? (
                <AlertTriangle className="w-6 h-6 text-warning-400" />
              ) : (
                <CheckCircle className="w-6 h-6 text-cyber-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-bold text-lg mb-3 ${
                isHighRisk ? 'text-warning-400' : 'text-cyber-400'
              }`}>
                {isHighRisk ? '권장 조치' : '분석 결과'}
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isHighRisk
                        ? 'bg-warning-500/20 text-warning-400'
                        : 'bg-cyber-500/20 text-cyber-400'
                    }`}>
                      {idx + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultDashboard
