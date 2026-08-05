import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { skillsService } from '../../services/skillsService';

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SkillsManagement = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 'Beginner' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillsService.getSkills();
      setSkills(response.data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      // Dummy fallback data until backend is ready
      setSkills([
        { id: 1, name: 'React.js', proficiency: 'Advanced' },
        { id: 2, name: 'Python', proficiency: 'Intermediate' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) {
      setMessage('Skill name is required');
      return;
    }

    try {
      const response = await skillsService.addSkill(newSkill);
      setSkills([...skills, response.data]);
    } catch (error) {
      console.error('Failed to add skill (using local fallback):', error);
      // Local fallback so UI still works without backend
      setSkills([...skills, { id: Date.now(), ...newSkill }]);
    }

    setNewSkill({ name: '', proficiency: 'Beginner' });
    setMessage('');
  };

  const handleDeleteSkill = async (id) => {
    try {
      await skillsService.deleteSkill(id);
    } catch (error) {
      console.error('Failed to delete on server (removing locally):', error);
    }
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Skills Management</h1>

      {/* Add new skill form */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Add New Skill</h2>
        {message && <p className="text-red-500 text-sm mb-3">{message}</p>}
        <form onSubmit={handleAddSkill} className="flex gap-3 items-end">
          <div className="flex-1">
            <InputField
              label="Skill Name"
              name="name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="e.g. JavaScript"
            />
          </div>
          <div className="flex-1 mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proficiency</label>
            <select
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
              {PROFICIENCY_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <Button type="submit" variant="primary">Add</Button>
          </div>
        </form>
      </Card>

      {/* Skills list */}
      <Card>
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Your Skills</h2>
        {skills.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex justify-between items-center border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2"
              >
                <div>
                  <span className="font-medium dark:text-gray-100">{skill.name}</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({skill.proficiency})</span>
                </div>
                <Button variant="danger" onClick={() => handleDeleteSkill(skill.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SkillsManagement;