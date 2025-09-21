import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  createUser, 
  updateUser, 
  deleteUser, 
  clearError 
} from '../redux/redux_slices/authSlice';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiUsers,
  FiUser,
  FiMail,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import { EmployeeFormModal, EmployeeViewModal } from '../components/modals';

const Employees = () => {
  const dispatch = useDispatch();
  const { users: employees, loading, error } = useSelector((state) => state.auth);
  const { teams } = useSelector((state) => state.teams);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterUserType, setFilterUserType] = useState('');

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  const handleCreateEmployee = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleViewEmployee = (employee) => {
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch(deleteUser(employeeId));
    }
  };

  const handleFormSubmit = (values) => {
    // Convert teamId to number if it exists and is not empty
    const processedValues = {
      ...values,
      teamId: values.teamId && values.teamId !== '' ? parseInt(values.teamId) : null
    };
    
    if (isCreateModalOpen) {
      dispatch(createUser(processedValues));
      setIsCreateModalOpen(false);
    } else if (isEditModalOpen) {
      dispatch(updateUser({ id: editingEmployee.id, ...processedValues }));
      setIsEditModalOpen(false);
      setEditingEmployee(null);
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setEditingEmployee(null);
    setViewingEmployee(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingEmployee(null);
  };

  // Get team name by ID
  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : null;
  };

  // Get team object by ID
  const getTeam = (teamId) => {
    return teams.find(t => t.id === teamId);
  };

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTeam = !filterTeam || employee.teamId === parseInt(filterTeam);
    const matchesUserType = !filterUserType || employee.userType === filterUserType;
    
    return matchesSearch && matchesTeam && matchesUserType;
  });

  return (
    <div className="bg-[var(--bg-primary)] !p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="!mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] !mb-3">Employee Management</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage your organization's employees and team assignments</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="!mb-6 !p-4 bg-red-100 border border-red-400 text-red-700 !rounded-lg">
            {error}   
          </div>
        )}

        {/* Controls */}
        <div className="!mb-6 flex flex-col lg:flex-row !gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row !gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute !left-3 !top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full !pl-10 !pr-4 !py-3 border border-[var(--border-color)] !rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              />
            </div>

            {/* Filters */}
            <div className="flex !gap-3">
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="!px-4 !py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              >
                <option value="">All Teams</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>

              <select
                value={filterUserType}
                onChange={(e) => setFilterUserType(e.target.value)}
                className="!px-4 !py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              >
                <option value="">All Types</option>
                <option value="employee">Employee</option>
                <option value="head">Team Head</option>
              </select>
            </div>
          </div>

          {/* Add Employee Button */}
          <button
            onClick={handleCreateEmployee}
            className="flex items-center !gap-2 !px-6 !py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary)]/90 transition-all duration-200 shadow-lg"
          >
            <FiPlus size={20} />
            Add Employee
          </button>
        </div>

        {/* Employees List */}
        <div className="bg-[var(--bg-secondary)] !rounded-xl shadow-lg border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg-tertiary)]">
                <tr>
                  <th className="!px-6 !py-4 text-left text-xs font-semibold text-[var(--text-primary)]">Employee</th>
                  <th className="!px-6 !py-4 text-left text-xs font-semibold text-[var(--text-primary)]">Email</th>
                  <th className="!px-6 !py-4 text-left text-xs font-semibold text-[var(--text-primary)]">Team</th>
                  <th className="!px-6 !py-4 text-left text-xs font-semibold text-[var(--text-primary)]">Type</th>
                  <th className="!px-6 !py-4 text-center text-xs font-semibold text-[var(--text-primary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredEmployees.map((employee) => {
                  const teamName = getTeamName(employee.teamId);
                  return (
                    <tr key={employee.id} className="hover:bg-[var(--bg-tertiary)] transition-colors duration-200">
                      <td className="!px-6 !py-4">
                        <div className="flex items-center !gap-3">
                          <div className="w-10 h-10 bg-[var(--accent-primary)] !rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-[var(--text-primary)]">
                              {employee.name}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              @{employee.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="!px-6 !py-4">
                        <div className="flex items-center !gap-2 text-xs text-[var(--text-secondary)]">
                          <FiMail size={16} />
                          <span>{employee.email}</span>
                        </div>
                      </td>
                      <td className="!px-6 !py-4">
                        <div className="flex items-center !gap-2 text-xs text-[var(--text-secondary)]">
                          <FiUsers size={16} />
                          <span>{teamName || 'No team assigned'}</span>
                        </div>
                      </td>
                      <td className="!px-6 !py-4">
                        <span className={`inline-block !px-3 !py-1 text-xs !rounded-full font-medium ${
                          employee.userType === 'head' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {employee.userType === 'head' ? 'Team Head' : 'Employee'}
                        </span>
                      </td>
                      <td className="!px-6 !py-4">
                        <div className="flex items-center justify-center !gap-2">
                          <button
                            onClick={() => handleViewEmployee(employee)}
                            className="!p-2 text-blue-600 hover:bg-blue-50 !rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="!p-2 text-green-600 hover:bg-green-50 !rounded-lg transition-colors duration-200"
                            title="Edit Employee"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="!p-2 text-red-600 hover:bg-red-50 !rounded-lg transition-colors duration-200"
                            title="Delete Employee"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && employees.length > 0 && (
          <div className="text-center !py-12">
            <FiUser size={64} className="mx-auto text-[var(--text-secondary)] !mb-4" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] !mb-2">No Employees Found</h3>
            <p className="text-[var(--text-secondary)] !mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterTeam('');
                setFilterUserType('');
              }}
              className="flex items-center !gap-2 !px-6 !py-3 bg-[var(--accent-primary)] text-white !rounded-lg hover:bg-[var(--accent-primary)]/90 transition-all duration-200 mx-auto"
            >
              <FiFilter size={20} />
              Clear Filters
            </button>
          </div>
        )}

        {employees.length === 0 && (
          <div className="text-center !py-12">
            <FiUser size={64} className="mx-auto text-[var(--text-secondary)] !mb-4" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] !mb-2">No Employees Found</h3>
            <p className="text-[var(--text-secondary)] !mb-6">Create your first employee to get started</p>
            <button
              onClick={handleCreateEmployee}
              className="flex items-center !gap-2 !px-6 !py-3 bg-[var(--accent-primary)] text-white !rounded-lg hover:bg-[var(--accent-primary)]/90 transition-all duration-200 mx-auto"
            >
              <FiPlus size={20} />
              Add Employee
            </button>
          </div>
        )}

        {/* Employee Form Modal */}
        <EmployeeFormModal
          isOpen={isCreateModalOpen || isEditModalOpen}
          onClose={isCreateModalOpen ? closeModals : closeEditModal}
          onSubmit={handleFormSubmit}
          initialValues={editingEmployee}
          isEdit={isEditModalOpen}
          loading={loading}
          teams={teams}
        />

        {/* Employee View Modal */}
        <EmployeeViewModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          employee={viewingEmployee}
          team={viewingEmployee ? getTeam(viewingEmployee.teamId) : null}
          onEdit={handleEditEmployee}
        />
      </div>
    </div>
  );
};

export default Employees;