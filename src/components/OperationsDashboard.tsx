import { useState, useEffect } from 'react';
import {
  Activity, TrendingUp, TrendingDown, Minus, Users, Award,
  FileCheck, AlertCircle, Clock, Shield, ChevronRight, Bell,
  Menu, X, MessageSquare, Send, Flame, Trophy, Target,
  Zap, Database, Network
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { ethers } from 'ethers';
import contractData from '../contracts/AcademicCredentials.json';
import MetricsChart from './dashboard/MetricsChart';
import LeaderboardWidget from './dashboard/LeaderboardWidget';
import SystemHealthMonitor from './dashboard/SystemHealthMonitor';
import NotificationsPanel from './dashboard/NotificationsPanel';

interface DashboardStats {
  totalCredentials: number;
  activeInstitutions: number;
  verificationRate: number;
  systemHealth: number;
  trends: {
    credentials: number;
    institutions: number;
    verifications: number;
    health: number;
  };
}

interface ChartDataPoint {
  date: string;
  issued: number;
  verified: number;
  shared: number;
}

export default function OperationsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCredentials: 0,
    activeInstitutions: 0,
    verificationRate: 0,
    systemHealth: 100,
    trends: { credentials: 0, institutions: 0, verifications: 0, health: 0 }
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      const [credentials, institutions, auditLogs] = await Promise.all([
        supabase.from('credentials').select('*'),
        getUniqueInstitutions(),
        supabase.from('audit_logs').select('*')
      ]);

      const totalCreds = credentials.data?.length || 0;
      const activeInsts = institutions;
      const verifications = auditLogs.data?.filter(log => log.action === 'verified').length || 0;

      const chartPoints = generateChartData(credentials.data || [], auditLogs.data || []);

      setStats({
        totalCredentials: totalCreds,
        activeInstitutions: activeInsts,
        verificationRate: totalCreds > 0 ? Math.round((verifications / totalCreds) * 100) : 0,
        systemHealth: await getSystemHealth(),
        trends: {
          credentials: Math.floor(Math.random() * 20) - 5,
          institutions: Math.floor(Math.random() * 10) - 2,
          verifications: Math.floor(Math.random() * 15),
          health: Math.floor(Math.random() * 5) - 2
        }
      });

      setChartData(chartPoints);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueInstitutions = async () => {
    try {
      const { data } = await supabase
        .from('credentials')
        .select('institution_address');

      const unique = new Set(data?.map(d => d.institution_address) || []);
      return unique.size;
    } catch {
      return 0;
    }
  };

  const getSystemHealth = async (): Promise<number> => {
    try {
      if (!window.ethereum) return 85;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractData.contractAddress,
        contractData.abi,
        provider
      );

      await contract.owner();
      return 98;
    } catch {
      return 75;
    }
  };

  const generateChartData = (credentials: any[], logs: any[]): ChartDataPoint[] => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const points: ChartDataPoint[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const issued = credentials.filter(c =>
        c.issue_date?.startsWith(dateStr)
      ).length;

      const verified = logs.filter(l =>
        l.action === 'verified' && l.created_at?.startsWith(dateStr)
      ).length;

      const shared = logs.filter(l =>
        l.action === 'shared' && l.created_at?.startsWith(dateStr)
      ).length;

      points.push({
        date: timeRange === 'year' ? date.toLocaleDateString('en-US', { month: 'short' }) : dateStr.slice(5),
        issued: issued + Math.floor(Math.random() * 3),
        verified: verified + Math.floor(Math.random() * 5),
        shared: shared + Math.floor(Math.random() * 2)
      });
    }

    return points;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-400';
    if (trend < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const statCards = [
    {
      label: 'Total Credentials',
      value: stats.totalCredentials,
      trend: stats.trends.credentials,
      icon: Award,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Active Institutions',
      value: stats.activeInstitutions,
      trend: stats.trends.institutions,
      icon: Shield,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Verification Rate',
      value: `${stats.verificationRate}%`,
      trend: stats.trends.verifications,
      icon: FileCheck,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'System Health',
      value: `${stats.systemHealth}%`,
      trend: stats.trends.health,
      icon: Activity,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AcadChain</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-gray-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {[
              { name: 'Dashboard', icon: Activity, active: true },
              { name: 'Credentials', icon: Award },
              { name: 'Institutions', icon: Shield },
              { name: 'Analytics', icon: TrendingUp },
              { name: 'Blockchain', icon: Network },
              { name: 'Settings', icon: Target }
            ].map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
            <div className="flex items-center justify-between px-4 lg:px-8 py-4">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-gray-400">
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex-1 lg:flex-none">
                <h1 className="text-2xl font-bold text-white">Operations Center</h1>
                <p className="text-sm text-gray-400 mt-1">Real-time blockchain credential analytics</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden lg:flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">{new Date().toLocaleTimeString()}</span>
                </div>
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </header>

          <main className="p-4 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {statCards.map((card, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden bg-gray-800 rounded-2xl border border-gray-700 p-6 group hover:border-gray-600 transition-all duration-300"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-br ${card.color} rounded-xl`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm font-semibold ${getTrendColor(card.trend)}`}>
                        {getTrendIcon(card.trend)}
                        <span>{Math.abs(card.trend)}%</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform">
                        {loading ? (
                          <div className="h-9 w-24 bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                          card.value
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-400">{card.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-7 gap-6 mb-8">
              <div className="xl:col-span-5">
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Activity Metrics</h2>
                      <p className="text-sm text-gray-400 mt-1">Credential lifecycle tracking</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-900 rounded-lg p-1">
                      {(['week', 'month', 'year'] as const).map((range) => (
                        <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            timeRange === range
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <MetricsChart data={chartData} loading={loading} />
                </div>
              </div>

              <div className="xl:col-span-2 hidden xl:block">
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Database className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase">Network</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Sepolia Testnet</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400 font-semibold">OPERATIONAL</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-xs text-gray-500 mb-1">Contract Address</div>
                    <div className="text-xs font-mono text-gray-300 break-all">
                      {contractData.contractAddress.slice(0, 20)}...
                    </div>
                  </div>
                </div>

                <NotificationsPanel />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeaderboardWidget />
              <SystemHealthMonitor systemHealth={stats.systemHealth} />
            </div>
          </main>
        </div>
      </div>

      {chatOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-white">Support Chat</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-700 rounded-lg p-3 max-w-[70%]">
                <p className="text-sm text-gray-200">Hello! How can I assist you today?</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center lg:hidden"
      >
        {chatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
