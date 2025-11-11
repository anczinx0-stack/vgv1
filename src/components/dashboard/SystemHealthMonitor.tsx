import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Activity, Database, Network, Shield } from 'lucide-react';

interface SystemHealthMonitorProps {
  systemHealth: number;
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: number;
  responseTime: number;
  icon: any;
}

export default function SystemHealthMonitor({ systemHealth }: SystemHealthMonitorProps) {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Blockchain RPC',
      status: 'operational',
      uptime: 99.9,
      responseTime: 120,
      icon: Network
    },
    {
      name: 'IPFS Gateway',
      status: 'operational',
      uptime: 98.5,
      responseTime: 250,
      icon: Database
    },
    {
      name: 'Supabase DB',
      status: 'operational',
      uptime: 99.7,
      responseTime: 80,
      icon: Database
    },
    {
      name: 'Smart Contract',
      status: 'operational',
      uptime: 100,
      responseTime: 150,
      icon: Shield
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: service.responseTime + Math.floor(Math.random() * 20) - 10,
        uptime: Math.min(100, service.uptime + (Math.random() * 0.1))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'down':
        return 'Down';
      default:
        return 'Unknown';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'from-green-500 to-emerald-500';
    if (health >= 80) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">System Health</h2>
          <p className="text-sm text-gray-400 mt-1">Service status monitoring</p>
        </div>
        <div className="relative">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#healthGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${(systemHealth / 100) * 176} 176`}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={systemHealth >= 95 ? '#10b981' : systemHealth >= 80 ? '#f59e0b' : '#ef4444'} />
                <stop offset="100%" stopColor={systemHealth >= 95 ? '#059669' : systemHealth >= 80 ? '#d97706' : '#dc2626'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{systemHealth}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <service.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">{service.name}</span>
                  {getStatusIcon(service.status)}
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-400">
                    {service.uptime.toFixed(1)}% uptime
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">
                    {service.responseTime}ms
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)} animate-pulse`}></div>
              <span className="text-xs font-semibold text-gray-300">
                {getStatusText(service.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Overall Status</span>
          <span className={`text-sm font-semibold ${systemHealth >= 95 ? 'text-green-400' : systemHealth >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
            {systemHealth >= 95 ? 'All Systems Operational' : systemHealth >= 80 ? 'Minor Issues Detected' : 'Service Disruption'}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getHealthColor(systemHealth)} transition-all duration-500`}
            style={{ width: `${systemHealth}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
