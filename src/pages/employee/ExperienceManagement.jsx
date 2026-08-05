import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { experienceService } from '../../services/experienceService';

const ExperienceManagement = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await experienceService.getExperience();
      setExperiences(response.data);
    } catch (error) {
      console.error('Failed to fetch experience:', error);
      // Dummy fallback until backend is ready
      setExperiences([
        {
          id: 1,
          companyName: 'ABC Tech Pvt Ltd',
          role: 'Junior Developer',
          startDate: '2023-06-01',
          endDate: '2024-05-01',
          description: 'Worked on frontend features using React.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.role.trim()) {
      setMessage('Company name and role are required');
      return;
    }

    try {
      const response = await experienceService.addExperience(formData);
      setExperiences([...experiences, response.data]);
    } catch (error) {
      console.error('Failed to add experience (using local fallback):', error);
      setExperiences([...experiences, { id: Date.now(), ...formData }]);
    }

    setFormData({ companyName: '', role: '', startDate: '', endDate: '', description: '' });
    setMessage('');
  };

  const handleDelete = async (id) => {
    try {
      await experienceService.deleteExperience(id);
    } catch (error) {
      console.error('Failed to delete on server (removing locally):', error);
    }
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold dark:text-gray-100 mb-6">Experience Management</h1>

      {/* Add new experience form */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Add Work Experience</h2>
        {message && <p className="text-red-500 text-sm mb-3">{message}</p>}
        <form onSubmit={handleAdd}>
          <InputField
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. ABC Tech Pvt Ltd"
          />
          <InputField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Software Developer"
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <InputField
                label="Start Date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="End Date"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Brief description of your role and responsibilities"
            />
          </div>
          <Button type="submit" variant="primary">Add Experience</Button>
        </form>
      </Card>

      {/* Experience list */}
      <Card>
        <h2 className="text-lg font-semibold dark:text-gray-100 mb-4">Your Experience</h2>
        {experiences.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No experience added yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold dark:text-gray-100">{exp.role} @ {exp.companyName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{exp.description}</p>
                    )}
                  </div>
                  <Button variant="danger" onClick={() => handleDelete(exp.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExperienceManagement;