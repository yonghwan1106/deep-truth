import { useState } from 'react'
import { AlertTriangle, CheckCircle, FileAudio, Calendar, ChevronRight } from 'lucide-react'

function HistoryPage() {
  const [history] = useState([
    {
      id: 1,
      fileName: 'voice_message_1.mp3',
      date: '2025-01-18 14:32',
      deepfakeProbability: 87,
      voiceprintMatch: 12,
      matchedPerson: '아들 (민준)',
      riskLevel: 'high'
    },
    {
      id: 2,
      fileName: 'kakao_voice.m4a',
      date: '2025-01-17 09:15',
      deepfakeProbability: 15,
      voiceprintMatch: 92,
      matchedPerson: '딸 (수진)',
      riskLevel: 'low'
    },
    {
      id: 3,
      fileName: 'unknown_call.wav',
      date: '2025-01-15 18:45',
      deepfakeProbability: 62,
      voiceprintMatch: 45,
      matchedPerson: '배우자',
      riskLevel: 'medium'
    },
  ])

  const getRiskBadge = (level) => {
    switch(level) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">위험</span>
      case 'medium':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">주의</span>
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">안전</span>
      default:
        return null
    }
  }

  const stats = {
    total: history.length,
    high: history.filter(h => h.riskLevel === 'high').length,
    safe: history.filter(h => h.riskLevel === 'low').length,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">분석 이력</h1>
        <p className="text-gray-600">지난 음성 분석 기록을 확인할 수 있습니다</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">전체 분석</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-red-600">{stats.high}</p>
          <p className="text-sm text-gray-500">위험 탐지</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">{stats.safe}</p>
          <p className="text-sm text-gray-500">안전 확인</p>
        </div>
      </div>

      {/* History List */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">최근 분석 기록</h2>
        <div className="divide-y divide-gray-100">
          {history.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between hover:bg-gray-50 -mx-6 px-6 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.riskLevel === 'high' ? 'bg-red-100' :
                  item.riskLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'
                }`}>
                  {item.riskLevel === 'high' ? (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  ) : item.riskLevel === 'low' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <FileAudio className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{item.fileName}</p>
                    {getRiskBadge(item.riskLevel)}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    <span>딥페이크 {item.deepfakeProbability}%</span>
                    <span>{item.matchedPerson} 일치 {item.voiceprintMatch}%</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {history.length === 0 && (
        <div className="card text-center py-12">
          <FileAudio className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">분석 이력이 없습니다</p>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
