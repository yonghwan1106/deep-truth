import { Link } from 'react-router-dom'
import { Shield, Mic, Users, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Shield className="w-4 h-4" />
          AI 기반 음성 진위 검증
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          딥페이크 음성 사기를<br />사전에 차단하세요
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Deep Truth는 AI 딥페이크 음성을 탐지하고 가족 성문(Voiceprint)과 대조하여
          진위를 검증하는 이중 검증 시스템입니다.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/analysis" className="btn-primary flex items-center gap-2">
            <Mic className="w-5 h-5" />
            음성 분석 시작
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/register" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
            <Users className="w-5 h-5" />
            가족 성문 등록
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">딥페이크 탐지</h3>
          <p className="text-gray-600">
            Wav2Vec2 기반 AI 모델로 합성 음성의 스펙트럼 아티팩트를 분석하여 딥페이크 여부를 판별합니다.
          </p>
        </div>
        <div className="card">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">성문 대조</h3>
          <p className="text-gray-600">
            등록된 가족의 성문(Voiceprint)과 비교하여 실제 가족의 목소리인지 확인합니다.
          </p>
        </div>
        <div className="card">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">이중 검증</h3>
          <p className="text-gray-600">
            딥페이크 탐지 + 성문 대조의 이중 검증으로 높은 정확도의 음성 진위 판별을 제공합니다.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">이용 방법</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: 1, title: '가족 성문 등록', desc: '가족의 음성을 미리 등록합니다' },
            { step: 2, title: '의심 음성 업로드', desc: '검증이 필요한 음성을 업로드합니다' },
            { step: 3, title: 'AI 분석', desc: '딥페이크 탐지 + 성문 대조 수행' },
            { step: 4, title: '결과 확인', desc: '상세 분석 리포트를 확인합니다' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                {item.step}
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Warning Banner */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">납치 빙자 사기 주의</h3>
            <p className="text-amber-700 text-sm">
              "엄마, 나 납치됐어"와 같은 음성 메시지를 받으셨다면, 송금 전에 반드시 Deep Truth로
              음성 진위를 확인하세요. 실제 가족에게 영상통화로 직접 확인하는 것도 좋은 방법입니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
