import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { learningPathService } from '../../services/learningPathService';

// Dummy fallback data until backend is ready
const DUMMY_PATH = [
  {
    id: 1,
    title: 'Master React Fundamentals',
    description: 'Complete advanced React concepts - Context API, custom hooks, performance optimization.',
    status: 'completed',
    duration: '2 weeks',
  },
  {
    id: 2,
    title: 'Learn TypeScript',
    description: 'Add type safety to your React applications for better code quality.',
    status: 'in-progress',
    duration: '3 weeks',
  },
  {
    id: 3,
    title: 'Testing with Jest & React Testing Library',
    description: 'Learn unit and integration testing for React components.',
    status: 'pending',
    duration: '2 weeks',
  },
  {
    id: 4,
    title: 'Advanced State Management',
    description: 'Explore Redux Toolkit or Zustand for complex application state.',
    status: 'pending',
    duration: '2 weeks',
  },
];

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-green-500', textColor: 'text-green-600', ring: 'ring-green-200' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500', textColor: 'text-blue-600', ring: 'ring-blue-200' },
  pending: { label: 'Pending', color: 'bg-gray-300', textColor: 'text-gray-500', ring: 'ring-gray-200' },
};

const LearningPath = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPath();
  }, []);

  const fetchPath = async () => {
    try {
      const response = await learningPathService.getLearningPath();
      setSteps(response.data);
    } catch (error) {
      console.error('Failed to fetch learning path:', error);
      setSteps(DUMMY_PATH);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2 dark:text-gray-100">Personalized Learning Path</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        A step-by-step plan to close your skill gaps and reach your career goal.
      </p>

      {/* Overall progress */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
          <span className="text-sm font-semibold text-blue-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {steps.map((step, index) => {
          const config = statusConfig[step.status];
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex gap-4 relative">
              {/* Timeline marker + connecting line */}
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${config.color} ring-4 ${config.ring} z-10`}></div>
                {!isLast && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 my-1"></div>}
              </div>

              {/* Step content */}
              <Card className={`mb-4 flex-1 ${step.status === 'in-progress' ? 'border-2 border-blue-200' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold dark:text-gray-100">{step.title}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.textColor} bg-opacity-10`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{step.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Estimated duration: {step.duration}</p>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPath;