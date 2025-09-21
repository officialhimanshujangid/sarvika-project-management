import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCalendar, FiUser, FiFlag, FiSearch, FiFilter, FiFolder } from 'react-icons/fi';
import { createTask, updateTask, deleteTask, clearError } from '../redux/redux_slices/tasksSlice';
import TaskFormModal from '../components/modals/TaskFormModal';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector(state => state.tasks);
  const { projects } = useSelector(state => state.projects);
  const { users, currentUser } = useSelector(state => state.auth);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getAssignedUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getProjectName(task.projectId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getAssignedUserName(task.assignedTo).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || task.projectId === parseInt(projectFilter);

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const handleCreateTask = (formData) => {
    dispatch(createTask({ ...formData, currentUser }));
    setIsCreateModalOpen(false);
  };

  const handleEditTask = (formData) => {
    dispatch(updateTask({ 
      id: editingTask.id, 
      projectId: editingTask.projectId, // Preserve projectId
      ...formData 
    }));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setEditingTask(null);
    dispatch(clearError());
  };

  if (error) {
    return (
      <div className="bg-[var(--bg-primary)] !p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 !px-4 !py-3 !rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-primary)] !p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center !mb-8 !gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] !mb-2">All Tasks</h1>
          <p className="text-[var(--text-secondary)]">Manage and track all tasks across projects</p>
        </div>
        {currentUser?.userType === 'head' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white !px-6 !py-3 !rounded-lg font-medium flex items-center !gap-2"
          >
            <FiPlus size={20} />
            Create Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-secondary)] !rounded-lg shadow-sm border border-[var(--border-color)] !p-6 !mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 !gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full !pl-10 !pr-4 !py-3 border border-[var(--border-color)] !rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full !px-4 !py-3 border border-[var(--border-color)] !rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full !px-4 !py-3 border border-[var(--border-color)] !rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full !px-4 !py-3 border border-[var(--border-color)] !rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center items-center !py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center !py-12">
          <div className="text-[var(--text-secondary)] !mb-4">
            <FiCalendar size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] !mb-2">No tasks found</h3>
          <p className="text-[var(--text-secondary)] !mb-6">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || projectFilter !== 'all'
              ? 'No tasks match your current filters.'
              : 'Get started by creating your first task.'}
          </p>
          {(!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && projectFilter === 'all') && currentUser?.userType === 'head' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white !px-6 !py-3 !rounded-lg font-medium flex items-center !gap-2 mx-auto"
            >
              <FiPlus size={20} />
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div key={task.id} className="bg-[var(--bg-secondary)] !rounded-lg shadow-sm border border-[var(--border-color)] !p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between !mb-4">
                <div className="flex-1">
                  <div className="flex items-center !gap-3 !mb-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {task.title}
                    </h3>
                    <span className={`!px-2 !py-1 !rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`!px-2 !py-1 !rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center !gap-4 text-xs text-[var(--text-secondary)] !mb-3">
                    <div className="flex items-center !gap-1">
                      <FiFolder size={14} />
                      <Link 
                        to={`/projects/${task.projectId}`}
                        className="hover:text-[var(--accent-primary)] transition-colors"
                      >
                        {getProjectName(task.projectId)}
                      </Link>
                    </div>
                    <div className="flex items-center !gap-1">
                      <FiUser size={14} />
                      <span>{getAssignedUserName(task.assignedTo)}</span>
                    </div>
                    <div className="flex items-center !gap-1">
                      <FiCalendar size={14} />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[var(--text-secondary)] !mb-4 line-clamp-2">
                    <div 
                      className="rich-text-content"
                      dangerouslySetInnerHTML={{ __html: task.description || '<p>No description provided</p>' }} 
                    />
                  </div>
                </div>

                <div className="flex !gap-2">
                  {currentUser?.userType === 'head' && (
                    <>
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] !p-2 !rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
                        title="Edit Task"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-400 hover:text-red-600 !p-2 !rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete Task"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => handleCloseModals()}
        onSubmit={handleCreateTask}
      />

      <TaskFormModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditTask}
        task={editingTask}
        projectId={editingTask?.projectId}
      />
    </div>
  );
};

export default Tasks;
