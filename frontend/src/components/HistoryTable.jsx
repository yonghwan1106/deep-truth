/**
 * 분석 이력 테이블 컴포넌트
 */

import { FileAudio, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'

export function HistoryTable({ history, onSelect }) {
  if (!history || history.length === 0) {
    return (
      <div className="card-dark text-center py-12">
        <FileAudio className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">분석 이력이 없습니다</p>
        <p className="text-sm text-gray-600">음성 파일을 분석하면 여기에 기록됩니다</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-600/50">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              파일명
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              딥페이크 확률
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              성문 일치율
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              위험도
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              분석 일시
            </th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-600/30">
          {history.map((item) => {
            const isHighRisk = item.riskLevel === 'high' || item.riskLevel === 'critical'

            return (
              <tr
                key={item.id}
                onClick={() => onSelect?.(item)}
                className="hover:bg-dark-700/30 cursor-pointer transition-colors group"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isHighRisk
                        ? 'bg-danger-500/20 border border-danger-500/30'
                        : 'bg-safe-500/20 border border-safe-500/30'
                    }`}>
                      <FileAudio className={`w-5 h-5 ${
                        isHighRisk ? 'text-danger-400' : 'text-safe-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.filename || '음성 파일'}</p>
                      <p className="text-xs text-gray-500 font-mono">{item.duration || '-'}초</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`font-mono font-bold ${
                    item.deepfakeProbability > 60 ? 'text-danger-400' : 'text-safe-400'
                  }`}>
                    {item.deepfakeProbability}%
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`font-mono font-bold ${
                    item.voiceprintMatch < 40 ? 'text-danger-400' : 'text-safe-400'
                  }`}>
                    {item.voiceprintMatch}%
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  {isHighRisk ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-danger-500/20 text-danger-400 border border-danger-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      HIGH
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-safe-500/20 text-safe-400 border border-safe-500/30">
                      <CheckCircle className="w-3 h-3" />
                      LOW
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-gray-400">
                    {item.analyzedAt
                      ? new Date(item.analyzedAt).toLocaleString('ko-KR')
                      : '-'}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTable
