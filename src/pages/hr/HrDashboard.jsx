import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { hrService } from '../../services/hrService';
import { Search } from 'react-bootstrap-icons';
// Dummy fallback data until backend is ready
const DUMMY_EMPLOYEES = [
  { id: 1, name: 'Aarav Sharma', department: 'Engineering', skillScore: 78, status: 'On Track' },
  { id: 2, name: 'Priya Nair', department: 'Engineering', skillScore: 55, status: 'Needs Improvement' },
  { id: 3, name: 'Rahul Verma', department: 'Data Science', skillScore: 42, status: 'Critical Gap' },
  { id: 4, name: 'Sneha Iyer', department: 'Design', skillScore: 88, status: 'On Track' },
  { id: 5, name: 'Karthik Rajan', department: 'Engineering', skillScore: 63, status: 'Needs Improvement' },
];
const statusColor = {
  'On Track': 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  'Needs Improvement': 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Critical Gap': 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};
const DUMMY_TEAM_GAPS = [
  { skill: 'React.js', avgCurrent: 65, avgRequired: 85 },
  { skill: 'Python', avgCurrent: 55, avgRequired: 80 },
  { skill: 'SQL', avgCurrent: 60, avgRequired: 75 },
  { skill: 'Machine Learning', avgCurrent: 35, avgRequired: 70 },
  { skill: 'Cloud (AWS)', avgCurrent: 40, avgRequired: 75 },
];

const HrDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    const [statsRes, gapsRes, employeesRes] = await Promise.all([
      hrService.getOverviewStats(),
      hrService.getTeamSkillGaps(),
      hrService.getEmployees(),
    ]);
    setStats(statsRes.data);
    setTeamGaps(gapsRes.data);
    setEmployees(employeesRes.data);
  } catch (error) {
    console.error('Failed to fetch HR dashboard data:', error);
    setStats(DUMMY_STATS);
    setTeamGaps(DUMMY_TEAM_GAPS);
    setEmployees(DUMMY_EMPLOYEES);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <Loader />;

  const statCards = [
    { label: 'Total Employees', value: stats.totalEmployees, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Avg. Skill Score', value: `${stats.avgSkillScore}%`, color: 'text-green-600 dark:text-green-400' },
    { label: 'Assessments Completed', value: stats.assessmentsCompleted, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Critical Skill Gaps', value: stats.criticalGaps, color: 'text-red-600 dark:text-red-400' },
  ];
   const departments = ['All', ...new Set(employees.map((e) => e.department))];

   const filteredEmployees = employees.filter((emp) => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
      return matchesSearch && matchesDept;
   });
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-2 dark:text-gray-100">HR Analytics Dashboard</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Organization-wide overview of employee skills and gaps.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Team-wide skill gap chart */}
      <Card>
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Team-wide Skill Gaps (Average)</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={teamGaps} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="skill" angle={-20} textAnchor="end" interval={0} height={60} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgCurrent" fill="#3B82F6" name="Avg Current Level (%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="avgRequired" fill="#93C5FD" name="Avg Required Level (%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {/* Employee Table */}
<Card className="mt-6">
  <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
    <h2 className="text-lg font-semibold dark:text-gray-100">Employee Overview</h2>

    <div className="flex gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          type="text"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Department filter */}
      <select
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
        className="px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {departments.map((dept) => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>
    </div>
  </div>

  <table className="w-full text-sm">
    <thead>
      <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
        <th className="py-2">Name</th>
        <th className="py-2">Department</th>
        <th className="py-2">Skill Score</th>
        <th className="py-2">Status</th>
      </tr>
    </thead>
    <tbody>
      {filteredEmployees.map((emp) => (
        <tr key={emp.id} className="border-b border-gray-100 dark:border-gray-800">
          <td className="py-3 font-medium dark:text-gray-100">{emp.name}</td>
          <td className="py-3 dark:text-gray-300">{emp.department}</td>
          <td className="py-3 dark:text-gray-300">{emp.skillScore}%</td>
          <td className="py-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[emp.status]}`}>
              {emp.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {filteredEmployees.length === 0 && (
    <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">No employees found.</p>
  )}
</Card>
    </div>
  );
};

export default HrDashboard;