import { useState, useEffect } from 'react';
import { Trophy, Flame, TrendingUp, Award } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface InstitutionRank {
  address: string;
  name: string;
  credentialsIssued: number;
  streak: number;
  rank: number;
}

export default function LeaderboardWidget() {
  const [rankings, setRankings] = useState<InstitutionRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      const { data } = await supabase
        .from('credentials')
        .select('institution_address, institution_name');

      if (data) {
        const institutionMap = new Map<string, { name: string; count: number }>();

        data.forEach(cred => {
          const current = institutionMap.get(cred.institution_address) || { name: cred.institution_name, count: 0 };
          institutionMap.set(cred.institution_address, {
            name: current.name,
            count: current.count + 1
          });
        });

        const ranked = Array.from(institutionMap.entries())
          .map(([address, info], index) => ({
            address,
            name: info.name,
            credentialsIssued: info.count,
            streak: Math.floor(Math.random() * 30) + 1,
            rank: index + 1
          }))
          .sort((a, b) => b.credentialsIssued - a.credentialsIssued)
          .slice(0, 5);

        setRankings(ranked);
      }
    } catch (error) {
      console.error('Error loading rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-gray-600 to-gray-700';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Trophy className="w-4 h-4" />;
    return <Award className="w-4 h-4" />;
  };

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Top Institutions</h2>
          <p className="text-sm text-gray-400 mt-1">Ranked by credential issuance</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
          <Trophy className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg animate-pulse">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : rankings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No institutions ranked yet</p>
          </div>
        ) : (
          rankings.map((institution) => (
            <div
              key={institution.address}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                institution.rank === 1
                  ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${getRankColor(institution.rank)} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {getRankIcon(institution.rank)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white truncate">
                    {institution.name}
                  </span>
                  {institution.rank === 1 && (
                    <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
                      TOP
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-400 font-mono">
                    {institution.address.slice(0, 8)}...
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-orange-400">
                    <Flame className="w-3 h-3" />
                    <span className="font-semibold">{institution.streak}d</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {institution.credentialsIssued}
                </div>
                <div className="text-xs text-gray-400">issued</div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && rankings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Tracked</span>
            <span className="text-white font-semibold">{rankings.reduce((sum, r) => sum + r.credentialsIssued, 0)} credentials</span>
          </div>
        </div>
      )}
    </div>
  );
}
