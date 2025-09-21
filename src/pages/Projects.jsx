import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCalendar, FiUsers, FiFlag, FiSearch, FiFilter } from 'react-icons/fi';
import { createProject, updateProject, deleteProject, clearError } from '../redux/redux_slices/projectsSlice';
import ProjectFormModal from '../components/modals/ProjectFormModal';

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector(state => state.projects);
  const { teams } = useSelector(state => state.teams);
  const { currentUser } = useSelector(state => state.auth);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'on_hold': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getTeamName(project.teamId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateProject = (formData) => {
    dispatch(createProject({ ...formData, currentUser }));
    setIsCreateModalOpen(false);
  };

  const handleEditProject = (formData) => {
    dispatch(updateProject({ id: editingProject.id, ...formData }));
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(projectId));
    }
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setEditingProject(null);
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
          <h1 className="text-3xl font-bold text-[var(--text-primary)] !mb-2">Projects</h1>
          <p className="text-[var(--text-secondary)]">Manage and track your projects</p>
        </div>
        {currentUser?.userType === 'head' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white !px-6 !py-3 !rounded-lg font-medium flex items-center !gap-2"
          >
            <FiPlus size={20} />
            Create Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-secondary)] !rounded-lg shadow-sm border border-[var(--border-color)] !p-6 !mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 !gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
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
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
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
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center items-center !py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center !py-12">
          <div className="text-[var(--text-secondary)] !mb-4">
            <FiCalendar size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-[var(--text-primary)] !mb-2">No projects found</h3>
          <p className="text-[var(--text-secondary)] !mb-6">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'No projects match your current filters.'
              : 'Get started by creating your first project.'}
          </p>
          {(!searchTerm && statusFilter === 'all' && priorityFilter === 'all') && currentUser?.userType === 'head' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white !px-6 !py-3 !rounded-lg font-medium flex items-center !gap-2 mx-auto"
            >
              <FiPlus size={20} />
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 !gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-[var(--bg-secondary)] !rounded-lg shadow-sm border border-[var(--border-color)] overflow-hidden hover:shadow-md transition-shadow">
              <div className="!p-6">
                {/* Project Header */}
                <div className="flex justify-between items-start !mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] !mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {getTeamName(project.teamId)}
                    </p>
                  </div>
                  <div className="flex !gap-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </Link>
                    {currentUser?.userType === 'head' && (
                      <>
                        <button
                          onClick={() => setEditingProject(project)}
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          title="Edit Project"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Project"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="flex !gap-2 !mb-4">
                  <span className={`!px-3 !py-1 !rounded-full text-xs font-medium ${getStatusColor(project.status || 'planning')}`}>
                    {(project.status || 'planning').replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`!px-3 !py-1 !rounded-full text-xs font-medium ${getPriorityColor(project.priority || 'medium')}`}>
                    {(project.priority || 'medium').toUpperCase()}
                  </span>
                </div>

                {/* Description Preview */}
                <div className="text-sm text-[var(--text-secondary)] !mb-4 line-clamp-3">
                  <div 
                    className="rich-text-content"
                    dangerouslySetInnerHTML={{ __html: project.description || '<p>No description provided</p>' }} 
                  />
                </div>

                {/* Dates */}
                <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                  <div>
                    <span className="font-medium">Start:</span> {new Date(project.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">End:</span> {new Date(project.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ProjectFormModal
        isOpen={isCreateModalOpen}
        onClose={() => handleCloseModals()}
        onSubmit={handleCreateProject}
      />

      <ProjectFormModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={handleEditProject}
        project={editingProject}
      />
    </div>
  );
};

export default Projects;
