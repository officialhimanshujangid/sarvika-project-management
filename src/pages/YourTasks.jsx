import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiUser, 
  FiFolder, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle, 
  FiSearch, 
  FiTrendingDown, 
  FiMoreHorizontal,
  FiTarget,
  FiZap,
  FiEye
} from 'react-icons/fi';
import { updateTaskStatus } from '../redux/redux_slices/tasksSlice';
import { TaskViewModal } from '../components/modals';

const YourTasks = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const { tasks } = useSelector(state => state.tasks);
  const { projects } = useSelector(state => state.projects);
  const { teams } = useSelector(state => state.teams);

  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [viewingTask, setViewingTask] = useState(null);

  // Filter tasks assigned to current user
  const userTasks = tasks?.filter(task => task.assignedTo === currentUser.id);

  const getProjectName = useCallback((projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  }, [projects]);

  const getProjectTeam = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;
    const team = teams.find(t => t.id === project.teamId);
    return team ? team.name : 'Unknown Team';
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


  // Enhanced filtering and sorting with useMemo for performance
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = userTasks.filter(task => {
      const matchesStatus = statusFilter === 'all' || (task.status || 'todo') === statusFilter;
      const matchesPriority = priorityFilter === 'all' || (task.priority || 'medium') === priorityFilter;
      const matchesSearch = searchTerm === '' || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getProjectName(task.projectId).toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesSearch;
    });

  

    return filtered;
  }, [userTasks, statusFilter, priorityFilter, searchTerm, getProjectName]);

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'todo': return 'in_progress';
      case 'in_progress': return 'completed';
      case 'completed': return 'todo';
      default: return 'in_progress';
    }
  };

  const getStatusButtonText = (currentStatus) => {
    switch (currentStatus) {
      case 'todo': return 'Start Task';
      case 'in_progress': return 'Mark Complete';
      case 'completed': return 'Reopen Task';
      default: return 'Start Task';
    }
  };

  // Enhanced statistics
  const taskStats = useMemo(() => {
    const total = userTasks.length;
    const completed = userTasks.filter(t => (t.status || 'todo') === 'completed').length;
    const inProgress = userTasks.filter(t => (t.status || 'todo') === 'in_progress').length;
    const todo = userTasks.filter(t => (t.status || 'todo') === 'todo').length;
    const highPriority = userTasks.filter(t => (t.priority || 'medium') === 'high' && (t.status || 'todo') !== 'completed').length;

    
    return {
      total,
      completed,
      inProgress,
      todo,
      highPriority,
    };
  }, [userTasks]);

  const getStatusButtonColor = (currentStatus) => {
    switch (currentStatus) {
      case 'todo': return 'bg-blue-500 hover:bg-blue-600';
      case 'in_progress': return 'bg-green-500 hover:bg-green-600';
      case 'completed': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="bg-[var(--bg-primary)] !p-6">
      {/* Enhanced Header */}
      <div className="!mb-8">
        <div className="flex items-center justify-between !mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] !mb-2 flex items-center !gap-3">
              <FiTarget className="text-[var(--accent-primary)]" size={32} />
              Your Tasks
            </h1>
            <p className="text-[var(--text-secondary)]">
              Manage your assigned tasks and track your progress
            </p>
          </div>
          <div className="flex items-center !gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="!p-2 !rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors"
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? <FiMoreHorizontal size={20} /> : <FiTarget size={20} />}
            </button>
          </div>
        </div>

        {/* Enhanced Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 !gap-4 !mb-6">
          <div className="bg-[var(--bg-secondary)] !rounded-lg !p-4 border border-[var(--border-color)]">
            <div className="flex items-center !gap-2 !mb-2">
              <FiTarget className="text-[var(--accent-primary)]" size={20} />
              <span className="text-sm font-medium text-[var(--text-secondary)]">Total</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{taskStats.total}</div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] !rounded-lg !p-4 border border-[var(--border-color)]">
            <div className="flex items-center !gap-2 !mb-2">
              <FiCheckCircle className="text-green-500" size={20} />
              <span className="text-sm font-medium text-[var(--text-secondary)]">Completed</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{taskStats.completed}</div>
            <div className="text-xs text-[var(--text-secondary)]">{taskStats.completionRate}%</div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] !rounded-lg !p-4 border border-[var(--border-color)]">
            <div className="flex items-center !gap-2 !mb-2">
              <FiAlertCircle className="text-blue-500" size={20} />
              <span className="text-sm font-medium text-[var(--text-secondary)]">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{taskStats.inProgress}</div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] !rounded-lg !p-4 border border-[var(--border-color)]">
            <div className="flex items-center !gap-2 !mb-2">
              <FiClock className="text-gray-500" size={20} />
              <span className="text-sm font-medium text-[var(--text-secondary)]">To Do</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{taskStats.todo}</div>
          </div>
          
          
          
          <div className="bg-[var(--bg-secondary)] !rounded-lg !p-4 border border-[var(--border-color)]">
            <div className="flex items-center !gap-2 !mb-2">
              <FiZap className="text-yellow-500" size={20} />
              <span className="text-sm font-medium text-[var(--text-secondary)]">High Priority</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{taskStats.highPriority}</div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
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

         
        </div>
      </div>

      {/* Enhanced Tasks List */}
      {filteredAndSortedTasks.length === 0 ? (
        <div className="text-center !py-12">
          <div className="text-[var(--text-secondary)] !mb-4">
            <FiCalendar size={64} className="!mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-[var(--text-primary)] !mb-2">No tasks found</h3>
          <p className="text-[var(--text-secondary)]">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? "No tasks match your current filters."
              : "You don't have any assigned tasks yet."}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 !gap-6' : '!space-y-4'}>
          {filteredAndSortedTasks.map(task => {
         
            return (
              <div 
                key={task.id} 
                className={`bg-[var(--bg-secondary)] !rounded-lg shadow-sm border border-[var(--border-color)] !p-6 hover:shadow-md transition-all duration-200 `}
              >
                <div className="flex items-start justify-between !mb-4">
                  <div className="flex-1">
                    <div className="flex items-center !gap-3 !mb-2">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        {task.title}
                      </h3>
                      <span className={`!px-2 !py-1 !rounded-full text-xs font-medium flex items-center !gap-1 ${getStatusColor(task.status || 'todo')}`}>
                        {getStatusIcon(task.status || 'todo')}
                        {(task.status || 'todo').replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`!px-2 !py-1 !rounded-full text-xs font-medium flex items-center !gap-1 ${getPriorityColor(task.priority || 'medium')}`}>
                        {getPriorityIcon(task.priority || 'medium')}
                        {(task.priority || 'medium').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center !gap-4 text-sm text-[var(--text-secondary)] !mb-3">
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
                        <span>{getProjectTeam(task.projectId)}</span>
                      </div>
                     
                    </div>

                    <div className="text-sm text-[var(--text-secondary)] !mb-4 line-clamp-2">
                      <div 
                      
                        className="rich-text-content "
                        dangerouslySetInnerHTML={{ __html: task.description || '<p>No description provided</p>' }} 
                      />
                    </div>
                  </div>

                      <div className="flex flex-col !gap-2">
                        <button
                          onClick={() => setViewingTask(task)}
                          className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white !px-4 !py-2 !rounded-lg font-medium text-sm transition-colors hover:shadow-md flex items-center !gap-2"
                        >
                          <FiEye size={14} />
                          View Details
                        </button>
                        <button
                          onClick={() => handleStatusChange(task.id, getNextStatus(task.status || 'todo'))}
                          className={`${getStatusButtonColor(task.status || 'todo')} text-white !px-4 !py-2 !rounded-lg font-medium text-sm transition-colors hover:shadow-md`}
                        >
                          {getStatusButtonText(task.status || 'todo')}
                        </button>
                        <Link
                          to={`/projects/${task.projectId}`}
                          className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] text-sm text-center transition-colors !py-1"
                        >
                          View Project
                        </Link>
                      </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task View Modal */}
      <TaskViewModal
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        task={viewingTask}
      />
    </div>
  );
};

export default YourTasks;
