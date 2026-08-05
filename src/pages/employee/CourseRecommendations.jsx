import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { courseService } from '../../services/courseService';

// Dummy fallback data until backend is ready
const DUMMY_COURSES = [
  {
    id: 1,
    title: 'Advanced TypeScript for React Developers',
    provider: 'Udemy',
    duration: '12 hours',
    level: 'Intermediate',
    relatedSkill: 'TypeScript',
    rating: 4.6,
    link: '#',
  },
  {
    id: 2,
    title: 'Testing React Applications with Jest & RTL',
    provider: 'Coursera',
    duration: '8 hours',
    level: 'Intermediate',
    relatedSkill: 'Testing',
    rating: 4.7,
    link: '#',
  },
  {
    id: 3,
    title: 'Machine Learning Fundamentals with Python',
    provider: 'edX',
    duration: '20 hours',
    level: 'Beginner',
    relatedSkill: 'Machine Learning',
    rating: 4.5,
    link: '#',
  },
  {
    id: 4,
    title: 'SQL for Data Analysis',
    provider: 'Udemy',
    duration: '10 hours',
    level: 'Beginner',
    relatedSkill: 'SQL',
    rating: 4.4,
    link: '#',
  },
];

const levelColor = {
  Beginner: 'bg-green-50 text-green-600',
  Intermediate: 'bg-yellow-50 text-yellow-600',
  Advanced: 'bg-red-50 text-red-600',
};

const CourseRecommendations = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getRecommendedCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses(DUMMY_COURSES);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const skills = ['All', ...new Set(courses.map((c) => c.relatedSkill))];
  const filteredCourses = filter === 'All' ? courses : courses.filter((c) => c.relatedSkill === filter);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-2 dark:text-gray-100">Course Recommendations</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Courses tailored to close your identified skill gaps.
      </p>

      {/* Filter by skill */}
      <div className="flex flex-wrap gap-2 mb-6">
        {skills.map((skill) => (
          <button
            key={skill}
            onClick={() => setFilter(skill)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
               filter === skill
                 ? 'bg-blue-600 text-white border-blue-600'
                 : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${levelColor[course.level]}`}>
                {course.level}
              </span>
              <span className="text-xs text-yellow-500 font-medium">★ {course.rating}</span>
            </div>

            <h2 className="font-semibold mb-1 dark:text-gray-100">{course.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{course.provider} • {course.duration}</p>

            <div className="flex justify-between items-center">
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                {course.relatedSkill}
              </span>
              <a href={course.link} target="_blank" rel="noopener noreferrer">
                <Button variant="primary">View Course</Button>
              </a>
            </div>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">No courses found for this skill.</p>
      )}
    </div>
  );
};

export default CourseRecommendations;