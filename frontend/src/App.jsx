import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Shield, Mic, Users, History, Home as HomeIcon, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Home from './pages/Home'
import Analysis from './pages/Analysis'
import Register from './pages/Register'
import FamilyCode from './pages/FamilyCode'
import HistoryPage from './pages/History'

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        isActive
          ? 'bg-cyber-500/20 text-cyber-400 border border-cyber-500/30'
          : 'text-gray-400 hover:text-cyber-400 hover:bg-dark-700/50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </Link>
  )
}

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-600/50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-500 to-cyber-600 rounded-xl flex items-center justify-center glow-cyber group-hover:glow-cyber-strong transition-all duration-300">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-cyber-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">Deep<span className="text-gradient">Truth</span></span>
              <p className="text-[10px] text-gray-500 font-mono tracking-wider">VOICE VERIFICATION</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" icon={HomeIcon}>홈</NavLink>
            <NavLink to="/analysis" icon={Mic}>음성 분석</NavLink>
            <NavLink to="/register" icon={Users}>성문 등록</NavLink>
            <NavLink to="/family-code" icon={Shield}>가족 암호</NavLink>
            <NavLink to="/history" icon={History}>분석 이력</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-2">
            <NavLink to="/" icon={HomeIcon}>홈</NavLink>
            <NavLink to="/analysis" icon={Mic}>음성 분석</NavLink>
            <NavLink to="/register" icon={Users}>성문 등록</NavLink>
            <NavLink to="/family-code" icon={Shield}>가족 암호</NavLink>
            <NavLink to="/history" icon={History}>분석 이력</NavLink>
          </nav>
        )}
      </div>
    </header>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-950 bg-cyber-grid bg-noise">
        {/* Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-cyber w-96 h-96 -top-48 -left-48" />
          <div className="orb orb-purple w-96 h-96 top-1/2 -right-48" style={{ animationDelay: '2s' }} />
          <div className="orb orb-cyber w-64 h-64 bottom-0 left-1/3" style={{ animationDelay: '4s' }} />
        </div>

        <Navigation />

        {/* Main Content */}
        <main className="relative pt-24 pb-12 px-4 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/register" element={<Register />} />
              <Route path="/family-code" element={<FamilyCode />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative border-t border-dark-700/50 bg-dark-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyber-500 to-cyber-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-400 font-medium">Deep Truth</span>
              </div>
              <p className="text-gray-500 text-sm font-mono">
                AI 딥페이크 음성 검증 서비스 &copy; 2025
              </p>
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-safe-500 rounded-full animate-pulse" />
                  System Online
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
