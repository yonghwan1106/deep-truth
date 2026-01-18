import { Link } from 'react-router-dom'
import { Shield, Mic, Users, AlertTriangle, CheckCircle, ArrowRight, Waves, Fingerprint, Lock, Zap } from 'lucide-react'

function Home() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Contest Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="text-lg">🏆</span>
            피싱·스캠 예방을 위한 서비스 개발 경진대회 출품작
          </div>

          {/* Tech Badge */}
          <div className="inline-flex items-center gap-2 bg-cyber-500/10 border border-cyber-500/30 text-cyber-400 px-4 py-2 rounded-full text-sm font-mono mb-8 glow-cyber">
            <span className="w-2 h-2 bg-cyber-400 rounded-full animate-pulse" />
            AI-POWERED VOICE VERIFICATION
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            딥페이크 음성 사기를
            <br />
            <span className="text-gradient">사전에 차단하세요</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI 딥페이크 음성을 탐지하고 가족 성문(Voiceprint)과 대조하여
            진위를 검증하는 <span className="text-cyber-400 font-semibold">이중 검증 시스템</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/analysis" className="btn-cyber flex items-center gap-2 text-lg group">
              <Mic className="w-5 h-5" />
              음성 분석 시작
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="btn-outline flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              가족 성문 등록
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: '95%+', label: '탐지 정확도' },
              { value: '<10초', label: '분석 소요시간' },
              { value: '24/7', label: '실시간 보호' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-mono">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Waveform Decoration */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end gap-1 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-cyber-500 to-cyber-300 rounded-full"
              style={{
                height: `${Math.random() * 60 + 20}px`,
                animation: `wave 1s ease-in-out infinite`,
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">핵심 기능</h2>
          <p className="text-gray-400">세 단계의 검증 시스템으로 완벽한 보호</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1: Deepfake Detection */}
          <div className="card-dark group hover:glow-danger relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-danger-500/10 rounded-full blur-3xl group-hover:bg-danger-500/20 transition-all" />
            <div className="relative">
              <div className="w-14 h-14 bg-danger-500/20 rounded-2xl flex items-center justify-center mb-5 border border-danger-500/30 group-hover:glow-danger transition-all">
                <AlertTriangle className="w-7 h-7 text-danger-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">딥페이크 탐지</h3>
              <p className="text-gray-400 leading-relaxed">
                Wav2Vec2 기반 AI 모델로 합성 음성의 스펙트럼 아티팩트를 분석하여 딥페이크 여부를 판별합니다.
              </p>
              <div className="mt-4 pt-4 border-t border-dark-600/50">
                <div className="flex items-center gap-2 text-sm text-danger-400 font-mono">
                  <Zap className="w-4 h-4" />
                  DEEPFAKE DETECTION
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Voiceprint Matching */}
          <div className="card-dark group hover:glow-cyber relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-500/10 rounded-full blur-3xl group-hover:bg-cyber-500/20 transition-all" />
            <div className="relative">
              <div className="w-14 h-14 bg-cyber-500/20 rounded-2xl flex items-center justify-center mb-5 border border-cyber-500/30 group-hover:glow-cyber transition-all">
                <Fingerprint className="w-7 h-7 text-cyber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">성문 대조</h3>
              <p className="text-gray-400 leading-relaxed">
                ECAPA-TDNN 기반 화자 검증으로 등록된 가족의 성문과 비교하여 실제 가족인지 확인합니다.
              </p>
              <div className="mt-4 pt-4 border-t border-dark-600/50">
                <div className="flex items-center gap-2 text-sm text-cyber-400 font-mono">
                  <Waves className="w-4 h-4" />
                  VOICEPRINT MATCHING
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Double Verification */}
          <div className="card-dark group hover:glow-safe relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-safe-500/10 rounded-full blur-3xl group-hover:bg-safe-500/20 transition-all" />
            <div className="relative">
              <div className="w-14 h-14 bg-safe-500/20 rounded-2xl flex items-center justify-center mb-5 border border-safe-500/30 group-hover:glow-safe transition-all">
                <CheckCircle className="w-7 h-7 text-safe-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">이중 검증</h3>
              <p className="text-gray-400 leading-relaxed">
                딥페이크 탐지 + 성문 대조의 이중 검증으로 높은 정확도의 음성 진위 판별을 제공합니다.
              </p>
              <div className="mt-4 pt-4 border-t border-dark-600/50">
                <div className="flex items-center gap-2 text-sm text-safe-400 font-mono">
                  <Lock className="w-4 h-4" />
                  DUAL VERIFICATION
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative">
        <div className="card-glow">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">이용 방법</h2>
            <p className="text-gray-400">4단계로 완벽한 음성 검증</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: '가족 성문 등록', desc: '가족의 음성을 미리 등록합니다', icon: Users },
              { step: 2, title: '의심 음성 업로드', desc: '검증이 필요한 음성을 업로드합니다', icon: Mic },
              { step: 3, title: 'AI 분석', desc: '딥페이크 탐지 + 성문 대조 수행', icon: Zap },
              { step: 4, title: '결과 확인', desc: '상세 분석 리포트를 확인합니다', icon: CheckCircle },
            ].map((item, idx) => (
              <div key={item.step} className="relative text-center group">
                {/* Connector Line */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-cyber-500/50 to-transparent" />
                )}

                <div className="relative inline-flex">
                  <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center border border-cyber-500/30 group-hover:border-cyber-400 group-hover:glow-cyber transition-all">
                    <item.icon className="w-7 h-7 text-cyber-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-cyber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {item.step}
                  </span>
                </div>

                <h4 className="font-semibold text-white mt-4 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Banner */}
      <section className="card-dark border-warning-500/30 bg-warning-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-warning-500 via-warning-400 to-warning-500" />
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 bg-warning-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-warning-500/30">
            <AlertTriangle className="w-6 h-6 text-warning-400" />
          </div>
          <div>
            <h3 className="font-bold text-warning-400 text-lg mb-2">납치 빙자 사기 주의</h3>
            <p className="text-gray-300 leading-relaxed">
              "엄마, 나 납치됐어"와 같은 음성 메시지를 받으셨다면, 송금 전에 반드시 Deep Truth로
              음성 진위를 확인하세요. 실제 가족에게 영상통화로 직접 확인하는 것도 좋은 방법입니다.
            </p>
            <Link to="/analysis" className="inline-flex items-center gap-2 mt-4 text-warning-400 hover:text-warning-300 font-semibold transition-colors">
              지금 바로 분석하기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
