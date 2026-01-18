/**
 * 위험도 게이지 컴포넌트
 */

export function RiskGauge({ value, type = 'danger', label, sublabel }) {
  // 색상 결정
  const getColor = () => {
    if (type === 'danger' || value > 70) {
      return {
        bg: 'bg-danger-500/20',
        border: 'border-danger-500/30',
        text: 'text-danger-400',
        fill: 'bg-danger-500',
        glow: 'glow-danger',
      }
    }
    if (type === 'warning' || value > 40) {
      return {
        bg: 'bg-warning-500/20',
        border: 'border-warning-500/30',
        text: 'text-warning-400',
        fill: 'bg-warning-500',
        glow: '',
      }
    }
    return {
      bg: 'bg-safe-500/20',
      border: 'border-safe-500/30',
      text: 'text-safe-400',
      fill: 'bg-safe-500',
      glow: 'glow-safe',
    }
  }

  const color = getColor()

  // 위험도 텍스트
  const getRiskLabel = () => {
    if (value > 70) return 'HIGH'
    if (value > 40) return 'MEDIUM'
    return 'LOW'
  }

  return (
    <div className={`p-6 rounded-2xl ${color.bg} border ${color.border} ${color.glow}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm text-gray-400">{label}</h4>
          {sublabel && (
            <p className="text-xs text-gray-600 font-mono">{sublabel}</p>
          )}
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${color.bg} ${color.text} border ${color.border}`}>
          {getRiskLabel()}
        </span>
      </div>

      {/* Value Display */}
      <div className="flex items-end gap-2 mb-4">
        <span className={`text-5xl font-bold ${color.text}`}>{Math.round(value)}</span>
        <span className={`text-2xl ${color.text} opacity-70 mb-1`}>%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color.fill} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default RiskGauge
