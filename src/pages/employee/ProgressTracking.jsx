import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { progressService } from '../../services/progressService';

// Dummy fallback data until backend is ready
const DUMMY_PROGRESS = {
  stats: {
    skillsImproved: 5,
    coursesCompleted: 3,
    assessmentsTaken: 4,
    overallGrowth: 32,
  },
  monthlyProgress: [
    { month: 'Mar', score: 40 },
    { month: 'Apr', score: 48 },
    { month: 'May', score: 55 },
    { month: 'Jun', score: 62 },
    { month: 'Jul', score: 70 },
    { month: 'Aug', score: 72 },
  ],
  recentActivity: [
    { id: 1, activity: 'Completed "Advanced TypeScript" course', date: '2026-08-02' },
    { id: 2, activity: 'Retook Skill Assessment - React.js', date: '2026-07-28' },
    { id: 3, activity: 'Updated Skills Profile', date: '2026-07-20' },
    { id: 4, activity: 'Completed "Testing with Jest" course', date: '2026-07-10' },
  ],
};

const ProgressTracking = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await progressService.getProgress();
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      setProgress(DUMMY_PROGRESS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const { stats, monthlyProgress, recentActivity } = progress;

  const statCards = [
    { label: 'Skills Improved', value: stats.skillsImproved, color: 'text-blue-600' },
    { label: 'Courses Completed', value: stats.coursesCompleted, color: 'text-green-600' },
    { label: 'Assessments Taken', value: stats.assessmentsTaken, color: 'text-purple-600' },
    { label: 'Overall Growth', value: `${stats.overallGrowth}%`, color: 'text-orange-600' },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Progress Tracking</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Progress trend chart */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold dark:text-gray-100 mb-4">Skill Score Trend (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyProgress} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              name="Overall Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent activity */}
      <Card>
        <h2 className="text-lg font-semibold dark:text-gray-100 mb-4">Recent Activity</h2>
        <div className="flex flex-col gap-3">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <p className="text-sm text-gray-700 dark:text-gray-300">{item.activity}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-4">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProgressTracking;