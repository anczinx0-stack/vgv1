import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
  date: string;
  issued: number;
  verified: number;
  shared: number;
}

interface MetricsChartProps {
  data: ChartDataPoint[];
  loading: boolean;
}

export default function MetricsChart({ data, loading }: MetricsChartProps) {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorShared" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            style={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
            labelStyle={{ color: '#9ca3af', fontFamily: 'monospace' }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          />
          <Area
            type="monotone"
            dataKey="issued"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIssued)"
            name="Issued"
          />
          <Area
            type="monotone"
            dataKey="verified"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVerified)"
            name="Verified"
          />
          <Area
            type="monotone"
            dataKey="shared"
            stroke="#8b5cf6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorShared)"
            name="Shared"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
