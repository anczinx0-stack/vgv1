import { useState, useEffect } from 'react';
import { GraduationCap, Building2, Wallet, ShieldCheck, Home, ArrowRight, Shield, Activity } from 'lucide-react';
import LandingPage from './components/LandingPage';
import InstitutionDashboard from './components/InstitutionDashboard';
import StudentWallet from './components/StudentWallet';
import VerificationPortal from './components/VerificationPortal';
import AdminPanel from './components/AdminPanel';
import OperationsDashboard from './components/OperationsDashboard';
import { PageView } from './types/credential';

function App() {
  const [currentView, setCurrentView] = useState<PageView>('landing');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verify')) {
      setCurrentView('verify');
    }
  }, []);

  if (currentView === 'landing') {
    return <LandingPage onGetStarted={() => setCurrentView('selection')} />;
  }

  if (currentView === 'operations') {
    return <OperationsDashboard />;
  }

  if (currentView === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="max-w-7xl w-full px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <GraduationCap className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Portal</h1>
            <p className="text-xl text-gray-600">Select the option that best describes your role</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <button
              onClick={() => setCurrentView('operations')}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-500 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-cyan-600 transition-colors">
                <Activity className="w-8 h-8 text-cyan-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Operations</h3>
              <p className="text-gray-600 mb-4">Monitor platform analytics and system health</p>
              <div className="flex items-center justify-center text-cyan-600 font-semibold">
                View Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-500 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-600 transition-colors">
                <Shield className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Admin</h3>
              <p className="text-gray-600 mb-4">Authorize institutions to issue credentials</p>
              <div className="flex items-center justify-center text-orange-600 font-semibold">
                Manage Access
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('institution')}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                <Building2 className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Institution</h3>
              <p className="text-gray-600 mb-4">Issue and manage academic credentials for your students</p>
              <div className="flex items-center justify-center text-blue-600 font-semibold">
                Access Portal
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('student')}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 transition-colors">
                <Wallet className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Student</h3>
              <p className="text-gray-600 mb-4">View and share your academic credentials securely</p>
              <div className="flex items-center justify-center text-green-600 font-semibold">
                Access Wallet
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setCurrentView('verify')}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-500 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors">
                <ShieldCheck className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Verifier</h3>
              <p className="text-gray-600 mb-4">Verify the authenticity of academic credentials instantly</p>
              <div className="flex items-center justify-center text-purple-600 font-semibold">
                Start Verification
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setCurrentView('landing')}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center mx-auto"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('landing')}>
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Academic Credentials
              </span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentView('operations')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  currentView === 'operations'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Activity className="w-4 h-4 mr-2" />
                Operations
              </button>
              <button
                onClick={() => setCurrentView('landing')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  currentView === 'landing'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  currentView === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </button>
              <button
                onClick={() => setCurrentView('institution')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  currentView === 'institution'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Institution
              </button>
              <button
                onClick={() => setCurrentView('student')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  currentView === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Student
              </button>
              <button
                onClick={() => setCurrentView('verify')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  currentView === 'verify'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Verify
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'operations' && <OperationsDashboard />}
        {currentView === 'admin' && <AdminPanel />}
        {currentView === 'institution' && <InstitutionDashboard />}
        {currentView === 'student' && <StudentWallet />}
        {currentView === 'verify' && <VerificationPortal />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              Blockchain-Based Academic Credentials Platform
            </p>
            <p className="text-xs text-gray-500">
              Powered by Ethereum Sepolia, IPFS, and Soulbound Tokens
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
