import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { careerService } from '../../services/careerService';
import { ROUTES } from '../../constants/routes';

// Dummy fallback data until backend is ready
const DUMMY_RECOMMENDATIONS = [
  {
    id: 1,
    role: 'Frontend Developer (React Specialist)',
    matchPercentage: 85,
    description: 'Strong alignment with your React.js and UI development skills.',
    keySkillsNeeded: ['React.js', 'TypeScript', 'Testing'],
  },
  {
    id: 2,
    role: 'Full Stack Developer',
    matchPercentage: 70,
    description: 'Good foundation, but requires strengthening backend and database skills.',
    keySkillsNeeded: ['Node.js', 'SQL', 'API Design'],
  },
  {
    id: 3,
    role: 'Machine Learning Engineer',
    matchPercentage: 45,
    description: 'Significant skill development needed in ML and Python data libraries.',
    keySkillsNeeded: ['Machine Learning', 'Python', 'Statistics'],
  },
];

const getMatchColor = (percentage) => {
  if (percentage >= 75) return 'text-green-600 bg-green-50';
  if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

const CareerRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await careerService.getRecommendations();
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      setRecommendations(DUMMY_RECOMMENDATIONS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2 dark:text-gray-100">Career Recommendations</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Based on your skill assessment and current skill gaps, here are roles that best match your profile.
      </p>

      <div className="flex flex-col gap-4">
        {recommendations.map((rec) => (
          <Card key={rec.id}>
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold dark:text-gray-100">{rec.role}</h2>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getMatchColor(rec.matchPercentage)}`}>
                {rec.matchPercentage}% Match
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{rec.description}</p>

            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Key Skills Needed</p>
              <div className="flex flex-wrap gap-2">
                {rec.keySkillsNeeded.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Link to={ROUTES.LEARNING_PATH}>
              <Button variant="primary">View Learning Path</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CareerRecommendations;