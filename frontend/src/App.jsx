import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Shield, Mic, Users, History, Home as HomeIcon } from 'lucide-react'
import Home from './pages/Home'
import Analysis from './pages/Analysis'
import Register from './pages/Register'
import FamilyCode from './pages/FamilyCode'
import HistoryPage from './pages/History'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">Deep Truth</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <HomeIcon className="w-4 h-4" />
                  <span>홈</span>
                </Link>
                <Link to="/analysis" className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <Mic className="w-4 h-4" />
                  <span>음성 분석</span>
                </Link>
                <Link to="/register" className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <Users className="w-4 h-4" />
                  <span>성문 등록</span>
                </Link>
                <Link to="/family-code" className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <Shield className="w-4 h-4" />
                  <span>가족 암호</span>
                </Link>
                <Link to="/history" className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <History className="w-4 h-4" />
                  <span>분석 이력</span>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/register" element={<Register />} />
            <Route path="/family-code" element={<FamilyCode />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
            <p>Deep Truth - AI 딥페이크 음성 검증 서비스</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
