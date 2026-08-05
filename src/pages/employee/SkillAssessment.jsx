import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { assessmentService } from '../../services/assessmentService';
import { ROUTES } from '../../constants/routes';

// Dummy fallback questions until backend is ready
const DUMMY_QUESTIONS = [
  {
    id: 1,
    question: 'What does JSX stand for?',
    options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extra'],
    correctAnswer: 'JavaScript XML',
  },
  {
    id: 2,
    question: 'Which hook is used to manage state in a functional component?',
    options: ['useEffect', 'useState', 'useRef', 'useContext'],
    correctAnswer: 'useState',
  },
  {
    id: 3,
    question: 'What is the virtual DOM?',
    options: [
      'A real browser DOM',
      'A lightweight copy of the real DOM used for efficient updates',
      'A database',
      'A CSS framework',
    ],
    correctAnswer: 'A lightweight copy of the real DOM used for efficient updates',
  },
];

const SkillAssessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await assessmentService.getQuestions('react');
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions(DUMMY_QUESTIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await assessmentService.submitAssessment({ answers });
    } catch (error) {
      console.error('Submission failed (proceeding anyway with local data):', error);
    } finally {
      setSubmitting(false);
      // Navigate to results page regardless (backend or fallback)
      navigate(ROUTES.SKILL_GAP_RESULTS);
    }
  };

  if (loading) return <Loader />;
  if (questions.length === 0) return <p>No questions available.</p>;

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2 dark:text-gray-100">Skill Assessment</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Question {currentIndex + 1} of {questions.length}
      </p>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">{currentQuestion.question}</h2>
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option) => (
            <label
              key={option}
              className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
                answers[currentQuestion.id] === option
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={answers[currentQuestion.id] === option}
                onChange={() => handleSelectAnswer(currentQuestion.id, option)}
                className="accent-blue-600"
              />
              <span className="dark:text-gray-100">{option}</span>
            </label>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting || answeredCount < questions.length}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </Card>

    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
        Answered: {answeredCount} / {questions.length}
      </p>
    </div>
  );
};

export default SkillAssessment;