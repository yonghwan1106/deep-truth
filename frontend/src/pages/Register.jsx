import { useState } from 'react'
import { UserPlus, Mic, Trash2, CheckCircle, User, Fingerprint, Plus } from 'lucide-react'

function Register() {
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: '아들 (민준)', relationship: '아들', registered: true, sampleCount: 3 },
    { id: 2, name: '딸 (수진)', relationship: '딸', registered: true, sampleCount: 2 },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', relationship: '' })

  const handleAddMember = () => {
    if (newMember.name && newMember.relationship) {
      setFamilyMembers([
        ...familyMembers,
        {
          id: Date.now(),
          name: newMember.name,
          relationship: newMember.relationship,
          registered: false,
          sampleCount: 0
        }
      ])
      setNewMember({ name: '', relationship: '' })
      setShowForm(false)
    }
  }

  const handleDelete = (id) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-cyber-500/10 border border-cyber-500/30 text-cyber-400 px-3 py-1.5 rounded-full text-xs font-mono mb-4">
          <Fingerprint className="w-3 h-3" />
          VOICEPRINT REGISTRATION
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">가족 성문 등록</h1>
        <p className="text-gray-400">가족의 음성을 등록하여 성문(Voiceprint) 대조에 활용합니다</p>
      </div>

      {/* Family Members List */}
      <div className="space-y-4">
        {familyMembers.map((member) => (
          <div key={member.id} className="card-dark group hover:border-cyber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyber-500/20 to-cyber-600/20 rounded-2xl flex items-center justify-center border border-cyber-500/30">
                <User className="w-7 h-7 text-cyber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">{member.name}</h3>
                <p className="text-sm text-gray-500 font-mono">{member.relationship.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {member.registered ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-safe-500/10 rounded-lg border border-safe-500/30">
                  <CheckCircle className="w-4 h-4 text-safe-400" />
                  <span className="text-safe-400 text-sm font-medium">{member.sampleCount}개 샘플</span>
                </div>
              ) : (
                <button className="flex items-center gap-2 px-4 py-2 bg-cyber-500/10 rounded-lg border border-cyber-500/30 text-cyber-400 hover:bg-cyber-500/20 transition-colors">
                  <Mic className="w-4 h-4" />
                  <span className="text-sm font-medium">음성 녹음</span>
                </button>
              )}
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 text-gray-500 hover:text-danger-400 hover:bg-danger-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Member Form */}
      {showForm ? (
        <div className="card-glow">
          <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyber-400" />
            새 가족 구성원 추가
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">이름</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="input-dark"
                placeholder="예: 김민준"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">관계</label>
              <select
                value={newMember.relationship}
                onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                className="select-dark"
              >
                <option value="">선택하세요</option>
                <option value="아들">아들</option>
                <option value="딸">딸</option>
                <option value="배우자">배우자</option>
                <option value="부모님">부모님</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddMember} className="btn-cyber">
              추가하기
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full card-dark border-dashed border-2 border-dark-600 hover:border-cyber-500/50 flex items-center justify-center gap-3 py-8 text-gray-400 hover:text-cyber-400 transition-all group"
        >
          <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center border border-dark-600 group-hover:border-cyber-500/30 group-hover:bg-cyber-500/10 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">새 가족 구성원 추가</span>
        </button>
      )}

      {/* Tips */}
      <div className="card-dark border-cyber-500/20 bg-cyber-500/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-cyber-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-cyber-500/30">
            <Mic className="w-5 h-5 text-cyber-400" />
          </div>
          <div>
            <h4 className="font-semibold text-cyber-400 mb-2">등록 팁</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyber-500 rounded-full" />
                최소 3개 이상의 음성 샘플을 등록하면 정확도가 높아집니다
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyber-500 rounded-full" />
                조용한 환경에서 자연스러운 대화 톤으로 녹음하세요
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyber-500 rounded-full" />
                각 샘플은 5초 이상 녹음하는 것이 좋습니다
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
