import { useState, useEffect } from 'react';
import { usersAPI } from '../../../services/api';
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error(err.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-white">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-indigo-300 mt-1">Manage system users and roles</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
        <Input
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-indigo-300"
        />
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-indigo-300">Name</TableHead>
              <TableHead className="text-indigo-300">Email</TableHead>
              <TableHead className="text-indigo-300">Role</TableHead>
              <TableHead className="text-indigo-300">Status</TableHead>
              <TableHead className="text-indigo-300">Enrolled Courses</TableHead>
              <TableHead className="text-indigo-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id} className="border-white/10 hover:bg-white/5">
                <TableCell className="text-white font-medium">{user.name}</TableCell>
                <TableCell className="text-indigo-200">{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    user.role === 'Super Admin' ? 'bg-red-500/20 text-red-300' :
                    user.role === 'Admin' ? 'bg-purple-500/20 text-purple-300' :
                    user.role === 'Trainer' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    user.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-indigo-200">{user.enrolledCourses?.length || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost" className="text-indigo-300 hover:text-white hover:bg-white/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(user._id)}
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
