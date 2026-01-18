/**
 * 성문 카드 컴포넌트
 */

import { User, Trash2, Volume2, Calendar } from 'lucide-react'

export function VoiceprintCard({ voiceprint, onDelete, onPlay }) {
  // 관계 표시 텍스트
  const getRelationText = (relation) => {
    const relations = {
      son: '아들',
      daughter: '딸',
      spouse: '배우자',
      parent: '부모님',
      sibling: '형제/자매',
      other: '기타',
    }
    return relations[relation] || relation
  }

  // 아바타 색상
  const getAvatarColor = (relation) => {
    const colors = {
      son: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      daughter: 'bg-pink-500/20 border-pink-500/30 text-pink-400',
      spouse: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
      parent: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
      sibling: 'bg-green-500/20 border-green-500/30 text-green-400',
    }
    return colors[relation] || 'bg-gray-500/20 border-gray-500/30 text-gray-400'
  }

  return (
    <div className="card-dark group hover:border-cyber-500/30 transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${getAvatarColor(voiceprint.relation)}`}>
          <User className="w-7 h-7" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-white">{voiceprint.name}</h4>
            <span className="text-xs bg-dark-600 text-gray-400 px-2 py-0.5 rounded">
              {getRelationText(voiceprint.relation)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              {voiceprint.sample_count || voiceprint.sampleCount || 3}개 샘플
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {voiceprint.registered_at
                ? new Date(voiceprint.registered_at).toLocaleDateString()
                : '등록됨'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onPlay && (
            <button
              onClick={() => onPlay(voiceprint)}
              className="p-2 bg-cyber-500/20 hover:bg-cyber-500/30 rounded-lg text-cyber-400 transition-colors"
              title="샘플 재생"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(voiceprint)}
              className="p-2 bg-danger-500/20 hover:bg-danger-500/30 rounded-lg text-danger-400 transition-colors"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 pt-3 border-t border-dark-600/50 flex items-center justify-between">
        <span className="text-xs text-gray-500 font-mono">
          ID: {voiceprint.id}
        </span>
        <span className="flex items-center gap-1 text-xs text-safe-400">
          <span className="w-2 h-2 bg-safe-400 rounded-full" />
          활성
        </span>
      </div>
    </div>
  )
}

export default VoiceprintCard
