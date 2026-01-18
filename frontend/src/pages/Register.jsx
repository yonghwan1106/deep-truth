import { useState } from 'react'
import { UserPlus, Mic, Trash2, CheckCircle, User } from 'lucide-react'

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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">가족 성문 등록</h1>
        <p className="text-gray-600">가족의 음성을 등록하여 성문(Voiceprint) 대조에 활용합니다</p>
      </div>

      {/* Family Members List */}
      <div className="space-y-4">
        {familyMembers.map((member) => (
          <div key={member.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.relationship}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {member.registered ? (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>등록됨 ({member.sampleCount}개 샘플)</span>
                </div>
              ) : (
                <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                  <Mic className="w-4 h-4" />
                  음성 녹음
                </button>
              )}
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Member Form */}
      {showForm ? (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">새 가족 구성원 추가</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="예: 김민준"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">관계</label>
              <select
                value={newMember.relationship}
                onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <button onClick={handleAddMember} className="btn-primary">
              추가
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full card border-dashed border-2 border-gray-300 hover:border-primary-400 flex items-center justify-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          새 가족 구성원 추가
        </button>
      )}

      {/* Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">등록 팁</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>최소 3개 이상의 음성 샘플을 등록하면 정확도가 높아집니다</li>
          <li>조용한 환경에서 자연스러운 대화 톤으로 녹음하세요</li>
          <li>각 샘플은 5초 이상 녹음하는 것이 좋습니다</li>
        </ul>
      </div>
    </div>
  )
}

export default Register
