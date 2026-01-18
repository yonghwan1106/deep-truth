import { useState } from 'react'
import { Shield, Eye, EyeOff, Plus, Pencil, Trash2, Check, X } from 'lucide-react'

function FamilyCode() {
  const [codes, setCodes] = useState([
    { id: 1, name: '아들 (민준)', question: '첫 자전거를 산 나이는?', answer: '7살' },
    { id: 2, name: '딸 (수진)', question: '좋아하는 아이스크림 맛은?', answer: '민트초코' },
  ])
  const [visibleAnswers, setVisibleAnswers] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [newCode, setNewCode] = useState({ name: '', question: '', answer: '' })
  const [verifyMode, setVerifyMode] = useState(false)
  const [selectedCode, setSelectedCode] = useState(null)
  const [verifyAnswer, setVerifyAnswer] = useState('')
  const [verifyResult, setVerifyResult] = useState(null)

  const toggleVisibility = (id) => {
    setVisibleAnswers({ ...visibleAnswers, [id]: !visibleAnswers[id] })
  }

  const handleAddCode = () => {
    if (newCode.name && newCode.question && newCode.answer) {
      setCodes([...codes, { id: Date.now(), ...newCode }])
      setNewCode({ name: '', question: '', answer: '' })
      setShowForm(false)
    }
  }

  const handleDelete = (id) => {
    setCodes(codes.filter(c => c.id !== id))
  }

  const handleVerify = () => {
    if (selectedCode && verifyAnswer) {
      const code = codes.find(c => c.id === selectedCode)
      setVerifyResult(code.answer.toLowerCase() === verifyAnswer.toLowerCase())
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">가족 암호 관리</h1>
        <p className="text-gray-600">사전 약속된 암호 문구로 본인 여부를 추가 확인합니다</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit mx-auto">
        <button
          onClick={() => { setVerifyMode(false); setVerifyResult(null) }}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            !verifyMode ? 'bg-white shadow text-primary-600' : 'text-gray-600'
          }`}
        >
          암호 관리
        </button>
        <button
          onClick={() => { setVerifyMode(true); setVerifyResult(null) }}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            verifyMode ? 'bg-white shadow text-primary-600' : 'text-gray-600'
          }`}
        >
          암호 검증
        </button>
      </div>

      {verifyMode ? (
        /* Verify Mode */
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">암호 검증</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가족 구성원 선택</label>
              <select
                value={selectedCode || ''}
                onChange={(e) => { setSelectedCode(Number(e.target.value)); setVerifyResult(null) }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">선택하세요</option>
                {codes.map(code => (
                  <option key={code.id} value={code.id}>{code.name}</option>
                ))}
              </select>
            </div>

            {selectedCode && (
              <>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">질문</p>
                  <p className="font-medium text-gray-900">
                    {codes.find(c => c.id === selectedCode)?.question}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">답변 입력</label>
                  <input
                    type="text"
                    value={verifyAnswer}
                    onChange={(e) => { setVerifyAnswer(e.target.value); setVerifyResult(null) }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="답변을 입력하세요"
                  />
                </div>

                <button onClick={handleVerify} className="btn-primary w-full">
                  검증하기
                </button>

                {verifyResult !== null && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    verifyResult ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {verifyResult ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span className="font-medium">암호가 일치합니다!</span>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5" />
                        <span className="font-medium">암호가 일치하지 않습니다.</span>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        /* Manage Mode */
        <>
          <div className="space-y-4">
            {codes.map((code) => (
              <div key={code.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{code.name}</h3>
                      <p className="text-sm text-gray-500">Q: {code.question}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(code.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      {visibleAnswers[code.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary-600">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 ml-13">
                  <span className="text-sm text-gray-500">A: </span>
                  <span className="text-sm font-medium text-gray-900">
                    {visibleAnswers[code.id] ? code.answer : '••••••••'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {showForm ? (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">새 암호 추가</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">가족 구성원</label>
                  <input
                    type="text"
                    value={newCode.name}
                    onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="예: 아들 (민준)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">질문</label>
                  <input
                    type="text"
                    value={newCode.question}
                    onChange={(e) => setNewCode({ ...newCode, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="예: 우리 가족만 아는 비밀 질문"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">답변</label>
                  <input
                    type="text"
                    value={newCode.answer}
                    onChange={(e) => setNewCode({ ...newCode, answer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="정답을 입력하세요"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddCode} className="btn-primary">추가</button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600">취소</button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full card border-dashed border-2 border-gray-300 hover:border-primary-400 flex items-center justify-center gap-2 text-gray-600 hover:text-primary-600"
            >
              <Plus className="w-5 h-5" />
              새 암호 추가
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default FamilyCode
