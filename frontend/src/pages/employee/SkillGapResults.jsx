import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/common/PageHeader';
import { skillGapService } from '../../services/skillGapService';

// Dummy fallback data until backend is ready
const DUMMY_DATA = [
  { skill: 'React.js', currentLevel: 70, requiredLevel: 90 },
  { skill: 'Python', currentLevel: 60, requiredLevel: 80 },
  { skill: 'SQL', currentLevel: 50, requiredLevel: 75 },
  { skill: 'Machine Learning', currentLevel: 30, requiredLevel: 70 },
  { skill: 'Communication', currentLevel: 80, requiredLevel: 85 },
];

const SkillGapResults = () => {
  const [gapData, setGapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillGaps();
  }, []);

  const fetchSkillGaps = async () => {
    try {
      const response = await skillGapService.getSkillGapResults();
      setGapData(response.data || DUMMY_DATA);
    } catch (error) {
      console.error('Failed to fetch skill gaps:', error);
      setGapData(DUMMY_DATA);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const gapsWithDiff = (gapData.length ? gapData : DUMMY_DATA).map((item) => ({
    ...item,
    gap: Math.max(0, item.requiredLevel - item.currentLevel),
  }));

  const biggestGap = [...gapsWithDiff].sort((a, b) => b.gap - a.gap)[0] || gapsWithDiff[0];
  const strongestSkill = [...gapsWithDiff].sort((a, b) => a.gap - b.gap)[0] || gapsWithDiff[0];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Skill Gap Analysis Results" 
        subtitle="Compare your current skill ratings against target role requirements."
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-rose-500 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Biggest Skill Gap</p>
          <p className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{biggestGap.skill}</p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
            Gap: <span className="font-bold text-rose-600 dark:text-rose-400">{biggestGap.gap}%</span> (Current {biggestGap.currentLevel}% → Required {biggestGap.requiredLevel}%)
          </p>
        </Card>
        <Card className="border-l-4 border-emerald-500 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Strongest Skill</p>
          <p className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{strongestSkill.skill}</p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
            Current <span className="font-bold text-emerald-600 dark:text-emerald-400">{strongestSkill.currentLevel}%</span> (Required {strongestSkill.requiredLevel}%)
          </p>
        </Card>
      </div>

      {/* Bar chart comparing current vs required */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Current vs Required Skill Levels</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={gapsWithDiff} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis dataKey="skill" angle={-20} textAnchor="end" interval={0} height={60} stroke="#94a3b8" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Bar dataKey="currentLevel" fill="#2563eb" name="Current Level (%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="requiredLevel" fill="#14b8a6" name="Required Level (%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed table */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Detailed Breakdown</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700/80 text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              <th className="py-3 px-2">Skill</th>
              <th className="py-3 px-2">Current</th>
              <th className="py-3 px-2">Required</th>
              <th className="py-3 px-2">Gap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {gapsWithDiff.map((item) => (
              <tr key={item.skill} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-150">
                <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-white">{item.skill}</td>
                <td className="py-3.5 px-2 text-slate-600 dark:text-slate-300 font-semibold">{item.currentLevel}%</td>
                <td className="py-3.5 px-2 text-slate-600 dark:text-slate-300 font-semibold">{item.requiredLevel}%</td>
                <td className={`py-3.5 px-2 font-bold ${item.gap > 20 ? 'text-rose-600 dark:text-rose-400' : item.gap > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {item.gap > 0 ? `${item.gap}%` : 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default SkillGapResults;