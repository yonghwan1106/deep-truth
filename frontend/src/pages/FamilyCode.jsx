import { useState } from 'react'
import { Shield, Eye, EyeOff, Plus, Pencil, Trash2, Check, X, Lock, Key } from 'lucide-react'

function FamilyCode() {
  const [codes, setCodes] = useState([
    { id: 1, name: '아들 (민준)', question: '첫 자전거를 산 나이는?', answer: '7살' },
    { id: 2, name: '딸 (수진)', question: '좋아하는 아이스크림 맛은?', answer: '민트초코' },
  ])
  const [visibleAnswers, setVisibleAnswers] = useState({})
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
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-cyber-500/10 border border-cyber-500/30 text-cyber-400 px-3 py-1.5 rounded-full text-xs font-mono mb-4">
          <Key className="w-3 h-3" />
          FAMILY SECRET CODE
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">가족 암호 관리</h1>
        <p className="text-gray-400">사전 약속된 암호 문구로 본인 여부를 추가 확인합니다</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1.5 bg-dark-800 rounded-xl w-fit mx-auto border border-dark-600">
        <button
          onClick={() => { setVerifyMode(false); setVerifyResult(null) }}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
            !verifyMode
              ? 'bg-cyber-500/20 text-cyber-400 border border-cyber-500/30 glow-cyber'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          암호 관리
        </button>
        <button
          onClick={() => { setVerifyMode(true); setVerifyResult(null) }}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
            verifyMode
              ? 'bg-cyber-500/20 text-cyber-400 border border-cyber-500/30 glow-cyber'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          암호 검증
        </button>
      </div>

      {verifyMode ? (
        /* Verify Mode */
        <div className="card-glow">
          <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyber-400" />
            암호 검증
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">가족 구성원 선택</label>
              <select
                value={selectedCode || ''}
                onChange={(e) => { setSelectedCode(Number(e.target.value)); setVerifyResult(null) }}
                className="select-dark"
              >
                <option value="">선택하세요</option>
                {codes.map(code => (
                  <option key={code.id} value={code.id}>{code.name}</option>
                ))}
              </select>
            </div>

            {selectedCode && (
              <>
                <div className="p-5 bg-dark-900/50 rounded-xl border border-dark-600">
                  <p className="text-xs text-gray-500 font-mono mb-2">QUESTION</p>
                  <p className="text-lg font-medium text-white">
                    {codes.find(c => c.id === selectedCode)?.question}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">답변 입력</label>
                  <input
                    type="text"
                    value={verifyAnswer}
                    onChange={(e) => { setVerifyAnswer(e.target.value); setVerifyResult(null) }}
                    className="input-dark"
                    placeholder="답변을 입력하세요"
                  />
                </div>

                <button onClick={handleVerify} className="btn-cyber w-full">
                  검증하기
                </button>

                {verifyResult !== null && (
                  <div className={`p-5 rounded-xl flex items-center gap-4 ${
                    verifyResult
                      ? 'bg-safe-500/10 border border-safe-500/30'
                      : 'bg-danger-500/10 border border-danger-500/30'
                  }`}>
                    {verifyResult ? (
                      <>
                        <div className="w-12 h-12 bg-safe-500/20 rounded-xl flex items-center justify-center">
                          <Check className="w-6 h-6 text-safe-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-safe-400">암호가 일치합니다!</p>
                          <p className="text-sm text-gray-400">본인 확인이 완료되었습니다.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-danger-500/20 rounded-xl flex items-center justify-center">
                          <X className="w-6 h-6 text-danger-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-danger-400">암호가 일치하지 않습니다.</p>
                          <p className="text-sm text-gray-400">다시 확인해주세요.</p>
                        </div>
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
              <div key={code.id} className="card-dark group hover:border-cyber-500/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyber-500/20 rounded-xl flex items-center justify-center border border-cyber-500/30">
                      <Shield className="w-6 h-6 text-cyber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{code.name}</h3>
                      <p className="text-sm text-gray-500">Q: {code.question}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(code.id)}
                      className="p-2 text-gray-500 hover:text-cyber-400 hover:bg-cyber-500/10 rounded-lg transition-all"
                    >
                      {visibleAnswers[code.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button className="p-2 text-gray-500 hover:text-cyber-400 hover:bg-cyber-500/10 rounded-lg transition-all">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="p-2 text-gray-500 hover:text-danger-400 hover:bg-danger-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 ml-16">
                  <span className="text-sm text-gray-500">A: </span>
                  <span className="text-sm font-medium text-cyber-400 font-mono">
                    {visibleAnswers[code.id] ? code.answer : '••••••••'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {showForm ? (
            <div className="card-glow">
              <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyber-400" />
                새 암호 추가
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">가족 구성원</label>
                  <input
                    type="text"
                    value={newCode.name}
                    onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
                    className="input-dark"
                    placeholder="예: 아들 (민준)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">질문</label>
                  <input
                    type="text"
                    value={newCode.question}
                    onChange={(e) => setNewCode({ ...newCode, question: e.target.value })}
                    className="input-dark"
                    placeholder="예: 우리 가족만 아는 비밀 질문"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">답변</label>
                  <input
                    type="text"
                    value={newCode.answer}
                    onChange={(e) => setNewCode({ ...newCode, answer: e.target.value })}
                    className="input-dark"
                    placeholder="정답을 입력하세요"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAddCode} className="btn-cyber">추가하기</button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-3 text-gray-400 hover:text-white">취소</button>
                </div>
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
              <span className="font-medium">새 암호 추가</span>
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default FamilyCode
