import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
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
    fetchGapResults();
  }, []);

  const fetchGapResults = async () => {
    try {
      const response = await skillGapService.getSkillGapResults();
      setGapData(response.data);
    } catch (error) {
      console.error('Failed to fetch skill gap results:', error);
      setGapData(DUMMY_DATA);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  // Calculate biggest gaps for summary cards
  const gapsWithDiff = gapData.map((item) => ({
    ...item,
    gap: item.requiredLevel - item.currentLevel,
  }));
  const biggestGap = [...gapsWithDiff].sort((a, b) => b.gap - a.gap)[0];
  const strongestSkill = [...gapsWithDiff].sort((a, b) => a.gap - b.gap)[0];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Skill Gap Analysis Results</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-l-4 border-red-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Biggest Skill Gap</p>
          <p className="text-lg font-semibold mt-1 dark:text-gray-100">{biggestGap.skill}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Gap: {biggestGap.gap}% (Current {biggestGap.currentLevel}% → Required {biggestGap.requiredLevel}%)
          </p>
        </Card>
        <Card className="border-l-4 border-green-500">
          <p className="text-sm text-gray-500 dark:text-gray-400">Strongest Skill</p>
          <p className="text-lg font-semibold mt-1 dark:text-gray-100">{strongestSkill.skill}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Current {strongestSkill.currentLevel}% (Required {strongestSkill.requiredLevel}%)
          </p>
        </Card>
      </div>

      {/* Bar chart comparing current vs required */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold dark:text-gray-100 mb-4">Current vs Required Skill Levels</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={gapData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="skill" angle={-20} textAnchor="end" interval={0} height={60} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="currentLevel" fill="#3B82F6" name="Current Level (%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="requiredLevel" fill="#93C5FD" name="Required Level (%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed table */}
      <Card>
        <h2 className="text-lg font-semibold dark:text-gray-100 mb-4">Detailed Breakdown</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
              <th className="py-2">Skill</th>
              <th className="py-2">Current</th>
              <th className="py-2">Required</th>
              <th className="py-2">Gap</th>
            </tr>
          </thead>
          <tbody>
            {gapsWithDiff.map((item) => (
              <tr key={item.skill} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 font-medium dark:text-gray-100">{item.skill}</td>
                <td className="py-3 dark:text-gray-300">{item.currentLevel}%</td>
                <td className="py-3 dark:text-gray-300">{item.requiredLevel}%</td>
                <td className={`py-3 font-semibold ${item.gap > 20 ? 'text-red-500' : item.gap > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
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