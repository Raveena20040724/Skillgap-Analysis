import { useState, useEffect } from 'react';
import { Search } from 'react-bootstrap-icons';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { adminService } from '../../services/adminService';

// Dummy fallback data until backend is ready
const DUMMY_STATS = {
  totalUsers: 52,
  totalEmployees: 45,
  totalHR: 6,
  activeToday: 18,
};

const DUMMY_USERS = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav@company.com', role: 'Employee', status: 'Active' },
  { id: 2, name: 'Meena Iyer', email: 'meena@company.com', role: 'HR', status: 'Active' },
  { id: 3, name: 'Rahul Verma', email: 'rahul@company.com', role: 'Employee', status: 'Suspended' },
  { id: 4, name: 'Admin User', email: 'admin@company.com', role: 'Admin', status: 'Active' },
];

const roleColor = {
  Employee: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  HR: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Admin: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

const statusColor = {
  Active: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  Suspended: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getSystemStats(),
        adminService.getAllUsers(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setStats(DUMMY_STATS);
      setUsers(DUMMY_USERS);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await adminService.updateUserStatus(user.id, newStatus);
    } catch (error) {
      console.error('Failed to update on server (updating locally):', error);
    }
    setUsers(users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
  };

  if (loading) return <Loader />;

  const roles = ['All', 'Employee', 'HR', 'Admin'];
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Employees', value: stats.totalEmployees, color: 'text-green-600 dark:text-green-400' },
    { label: 'HR Staff', value: stats.totalHR, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Active Today', value: stats.activeToday, color: 'text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-2 dark:text-gray-100">Admin Dashboard</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Manage users, roles, and system-wide settings.
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

      {/* User management table */}
      <Card>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold dark:text-gray-100">User Management</h2>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 font-medium dark:text-gray-100">{user.name}</td>
                <td className="py-3 dark:text-gray-300">{user.email}</td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${roleColor[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3">
                  <Button
                    variant={user.status === 'Active' ? 'danger' : 'primary'}
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.status === 'Active' ? 'Suspend' : 'Activate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">No users found.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;