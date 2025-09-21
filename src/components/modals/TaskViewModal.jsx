import React from 'react';
import { FiX, FiCalendar, FiUser, FiFlag, FiFolder, FiClock, FiCheckCircle, FiAlertCircle, FiTarget, FiZap, FiTrendingDown, FiFileText } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const TaskViewModal = ({ isOpen, onClose, task }) => {
  const { users } = useSelector(state => state.auth);
  const { projects } = useSelector(state => state.projects);
  const { teams } = useSelector(state => state.teams);

  if (!isOpen || !task) return null;

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getProjectTeam = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;
    const team = teams.find(t => t.id === project.teamId);
    return team ? team.name : 'Unknown Team';
  };

  const getAssignedUser = () => {
    return users.find(user => user.id === task.assignedTo);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo': return <FiClock size={16} />;
      case 'in_progress': return <FiAlertCircle size={16} />;
      case 'completed': return <FiCheckCircle size={16} />;
      default: return <FiClock size={16} />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'low': return <FiTrendingDown size={14} />;
      case 'medium': return <FiTarget size={14} />;
      case 'high': return <FiZap size={14} />;
      default: return <FiTarget size={14} />;
    }
  };



  const isDueToday = (dueDate) => {
    return new Date(dueDate).toDateString() === new Date().toDateString();
  };

  const isDueSoon = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  const assignedUser = getAssignedUser();

  const isTaskDueToday = isDueToday(task.dueDate);
  const isTaskDueSoon = isDueSoon(task.dueDate);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] !p-4">
      <div className="bg-[var(--bg-secondary)] !rounded-xl !p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between !mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center !gap-3">
            <FiTarget className="text-[var(--accent-primary)]" size={24} />
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] !p-2 !rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Task Content */}
        <div className="space-y-6">
          {/* Title and Status */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] !mb-3">
              {task.title}
            </h3>
            <div className="flex items-center !gap-3">
              <span className={`!px-3 !py-1 !rounded-full text-xs font-medium flex items-center !gap-2 ${getStatusColor(task.status || 'todo')}`}>
                {getStatusIcon(task.status || 'todo')}
                {(task.status || 'todo').replace('_', ' ').toUpperCase()}
              </span>
              <span className={`!px-3 !py-1 !rounded-full text-xs font-medium flex items-center !gap-2 ${getPriorityColor(task.priority || 'medium')}`}>
                {getPriorityIcon(task.priority || 'medium')}
                {(task.priority || 'medium').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-[var(--text-primary)] !mb-3 flex items-center !gap-2">
              <FiFileText size={18} />
              Description
            </h4>
            <div className="bg-[var(--bg-primary)] !rounded-lg !p-4 border border-[var(--border-color)]">
              <div 
                className="rich-text-content text-[var(--text-secondary)]"
                dangerouslySetInnerHTML={{ __html: task.description || '<p class="text-[var(--text-secondary)] italic">No description provided</p>' }} 
              />
            </div>
          </div>

          {/* Task Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 !gap-6">
            {/* Project Information */}
            <div className="bg-[var(--bg-primary)] !rounded-lg !p-4 border border-[var(--border-color)]">
              <h4 className="text-sm font-medium text-[var(--text-primary)] !mb-3 flex items-center !gap-2">
                <FiFolder size={18} />
                Project Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center !gap-2">
                  <span className="text-[var(--text-secondary)] font-medium">Project:</span>
                  <span className="text-[var(--text-primary)]">{getProjectName(task.projectId)}</span>
                </div>
                <div className="flex items-center !gap-2">
                  <span className="text-[var(--text-secondary)] font-medium">Team:</span>
                  <span className="text-[var(--text-primary)]">{getProjectTeam(task.projectId)}</span>
                </div>
              </div>
            </div>

            {/* Assignment Information */}
            <div className="bg-[var(--bg-primary)] !rounded-lg !p-4 border border-[var(--border-color)]">
              <h4 className="text-sm font-medium text-[var(--text-primary)] !mb-3 flex items-center !gap-2">
                <FiUser size={18} />
                Assignment
              </h4>
              <div className="space-y-2">
                <div className="flex items-center !gap-2">
                  <span className="text-[var(--text-secondary)] font-medium">Assigned to:</span>
                  <span className="text-[var(--text-primary)]">
                    {assignedUser ? assignedUser.name : 'Unknown User'}
                  </span>
                </div>
                <div className="flex items-center !gap-2">
                  <span className="text-[var(--text-secondary)] font-medium">Email:</span>
                  <span className="text-[var(--text-primary)]">
                    {assignedUser ? assignedUser.email : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Due Date Information */}
          <div className="bg-[var(--bg-primary)] !rounded-lg !p-4 border border-[var(--border-color)]">
            <h4 className="text-sm font-medium text-[var(--text-primary)] !mb-3 flex items-center !gap-2">
              <FiCalendar size={18} />
              Due Date Information
            </h4>
            <div className="flex items-center !gap-2">
              <span className="text-[var(--text-secondary)] font-medium">Due Date:</span>
              <span className={`font-medium ${
                isTaskDueToday ? 'text-yellow-500' : 
                isTaskDueSoon ? 'text-orange-500' : 'text-[var(--text-primary)]'
              }`}>
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
             
              
            </div>
          </div>

         
        </div>

        {/* Footer */}
        <div className="flex justify-end !mt-6 !pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white !px-6 !py-2 !rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskViewModal;
