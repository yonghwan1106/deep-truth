import { useState } from 'react'
import { AlertTriangle, CheckCircle, FileAudio, Calendar, ChevronRight, BarChart3, Shield, Clock } from 'lucide-react'

function HistoryPage() {
  const [history] = useState([
    {
      id: '1',
      fileName: 'voice_message_1.mp3',
      date: '2025-01-18T14:32:00',
      deepfakeProbability: 87,
      voiceprintMatch: 12,
      matchedPerson: '아들 (민준)',
      riskLevel: 'high'
    },
    {
      id: '2',
      fileName: 'kakao_voice.m4a',
      date: '2025-01-17T09:15:00',
      deepfakeProbability: 15,
      voiceprintMatch: 92,
      matchedPerson: '딸 (수진)',
      riskLevel: 'low'
    },
    {
      id: '3',
      fileName: 'unknown_call.wav',
      date: '2025-01-15T18:45:00',
      deepfakeProbability: 62,
      voiceprintMatch: 45,
      matchedPerson: '배우자',
      riskLevel: 'medium'
    },
  ])

  const getRiskBadge = (level) => {
    switch(level) {
      case 'high':
        return <span className="badge-danger">HIGH RISK</span>
      case 'medium':
        return <span className="badge-warning">MEDIUM</span>
      case 'low':
        return <span className="badge-safe">SAFE</span>
      default:
        return null
    }
  }

  const getRiskIcon = (level) => {
    switch(level) {
      case 'high':
        return (
          <div className="w-12 h-12 bg-danger-500/20 rounded-xl flex items-center justify-center border border-danger-500/30">
            <AlertTriangle className="w-6 h-6 text-danger-400" />
          </div>
        )
      case 'medium':
        return (
          <div className="w-12 h-12 bg-warning-500/20 rounded-xl flex items-center justify-center border border-warning-500/30">
            <FileAudio className="w-6 h-6 text-warning-400" />
          </div>
        )
      case 'low':
        return (
          <div className="w-12 h-12 bg-safe-500/20 rounded-xl flex items-center justify-center border border-safe-500/30">
            <CheckCircle className="w-6 h-6 text-safe-400" />
          </div>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    total: history.length,
    high: history.filter(h => h.riskLevel === 'high').length,
    medium: history.filter(h => h.riskLevel === 'medium').length,
    safe: history.filter(h => h.riskLevel === 'low').length,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-cyber-500/10 border border-cyber-500/30 text-cyber-400 px-3 py-1.5 rounded-full text-xs font-mono mb-4">
          <Clock className="w-3 h-3" />
          ANALYSIS HISTORY
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">분석 이력</h1>
        <p className="text-gray-400">지난 음성 분석 기록을 확인할 수 있습니다</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-dark text-center">
          <div className="w-10 h-10 bg-cyber-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-cyber-500/30">
            <BarChart3 className="w-5 h-5 text-cyber-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-500 font-mono mt-1">TOTAL</p>
        </div>
        <div className="card-dark text-center">
          <div className="w-10 h-10 bg-danger-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-danger-500/30">
            <AlertTriangle className="w-5 h-5 text-danger-400" />
          </div>
          <p className="text-3xl font-bold text-danger-400">{stats.high}</p>
          <p className="text-xs text-gray-500 font-mono mt-1">HIGH RISK</p>
        </div>
        <div className="card-dark text-center">
          <div className="w-10 h-10 bg-warning-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-warning-500/30">
            <Shield className="w-5 h-5 text-warning-400" />
          </div>
          <p className="text-3xl font-bold text-warning-400">{stats.medium}</p>
          <p className="text-xs text-gray-500 font-mono mt-1">MEDIUM</p>
        </div>
        <div className="card-dark text-center">
          <div className="w-10 h-10 bg-safe-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-safe-500/30">
            <CheckCircle className="w-5 h-5 text-safe-400" />
          </div>
          <p className="text-3xl font-bold text-safe-400">{stats.safe}</p>
          <p className="text-xs text-gray-500 font-mono mt-1">SAFE</p>
        </div>
      </div>

      {/* History List */}
      <div className="card-glow">
        <h2 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyber-400" />
          최근 분석 기록
        </h2>
        <div className="divide-y divide-dark-600/50">
          {history.map((item) => (
            <div
              key={item.id}
              className="py-5 flex items-center justify-between hover:bg-dark-700/30 -mx-6 px-6 cursor-pointer transition-colors first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                {getRiskIcon(item.riskLevel)}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-white">{item.fileName}</p>
                    {getRiskBadge(item.riskLevel)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.date)}
                    </span>
                    <span className={`${
                      item.deepfakeProbability > 70 ? 'text-danger-400' :
                      item.deepfakeProbability > 40 ? 'text-warning-400' : 'text-safe-400'
                    }`}>
                      딥페이크 {item.deepfakeProbability}%
                    </span>
                    <span className="text-cyber-400">
                      {item.matchedPerson} {item.voiceprintMatch}%
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </div>
          ))}
        </div>
      </div>

      {history.length === 0 && (
        <div className="card-dark text-center py-16">
          <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dark-600">
            <FileAudio className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-400 mb-2">분석 이력이 없습니다</p>
          <p className="text-sm text-gray-600">음성 분석을 시작하면 이력이 여기에 표시됩니다</p>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
