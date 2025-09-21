import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiCalendar, FiUser, FiFlag, FiClock, FiCheckCircle, FiSettings, FiX, FiEye } from 'react-icons/fi';
import { createTask, updateTask, updateTaskStatus, deleteTask, clearError } from '../redux/redux_slices/tasksSlice';
import { updateProject } from '../redux/redux_slices/projectsSlice';
import TaskFormModal from '../components/modals/TaskFormModal';
import { TaskViewModal } from '../components/modals';

const TaskCard = ({ task, onEdit, onDelete, onView }) => {
  const { users } = useSelector(state => state.auth);

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getAssignedUser = () => {
    return users.find(user => user.id === task.assignedTo);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const assignedUser = getAssignedUser();

  return (
    <div
      ref={drag}
      className={`bg-[var(--bg-secondary)] !rounded-lg shadow-sm border border-[var(--border-color)] !p-4 !mb-3 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start !mb-3">
        <h4 className="font-medium text-[var(--text-primary)] text-xs">{task.title}</h4>
        <div className="flex !gap-2">
          <button
            onClick={() => onView(task)}
            className="text-[var(--accent-primary)] hover:text-[var(--accent-primary)]/80"
            title="View Details"
          >
            <FiEye size={14} />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            title="Edit Task"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-400 hover:text-red-600"
            title="Delete Task"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      <div className="text-xs text-[var(--text-secondary)] !mb-3 line-clamp-2">
        <div 
          className="rich-text-content"
          dangerouslySetInnerHTML={{ __html: task.description || '<p>No description provided</p>' }} 
        />
      </div>

      <div className="flex items-center justify-between">
        <span className={`!px-2 !py-1 !rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority.toUpperCase()}
        </span>
        <div className="text-xs text-[var(--text-secondary)]">
          {assignedUser ? assignedUser.name : 'Unassigned'}
        </div>
      </div>

      <div className="text-xs text-[var(--text-secondary)] !mt-2">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </div>
    </div>
  );
};

const TaskColumn = ({ status, tasks, onTaskDrop, onEdit, onDelete, onView }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      if (item.status !== status) {
        onTaskDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'todo':
        return { title: 'To Do', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: FiClock };
      case 'in_progress':
        return { title: 'In Progress', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: FiCalendar };
      case 'completed':
        return { title: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: FiCheckCircle };
      default:
        return { title: status, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: FiClock };
    }
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <div
      ref={drop}
      className={`flex-1 !min-h-[500px] !p-4 !rounded-lg border-2 border-dashed transition-colors ${
        isOver ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'border-[var(--border-color)]'
      }`}
    >
      <div className="flex items-center !mb-4">
        <StatusIcon className="!mr-2 text-[var(--text-secondary)]" size={18} />
        <h3 className="font-semibold text-[var(--text-primary)]">{statusInfo.title}</h3>
        <span className={`!ml-auto !px-2 !py-1 !rounded-full text-xs font-medium ${statusInfo.color}`}>
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { projects } = useSelector(state => state.projects);
  const { tasks, loading, error } = useSelector(state => state.tasks);
  const { teams } = useSelector(state => state.teams);
  const { currentUser } = useSelector(state => state.auth);


  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);

  const project = projects.find(p => p.id === parseInt(id));
  

  const projectTasks = tasks.filter(task => task.projectId === parseInt(id));

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

  const handleTaskDrop = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const handleCreateTask = (formData) => {
    dispatch(createTask({ ...formData, currentUser }));
    setIsCreateTaskModalOpen(false);
  };

  const handleEditTask = (formData) => {
    dispatch(updateTask({ 
      id: editingTask.id, 
      projectId: parseInt(id), // Ensure projectId is passed
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
    setIsCreateTaskModalOpen(false);
    setEditingTask(null);
    setIsStatusModalOpen(false);
    dispatch(clearError());
  };

  const handleStatusChange = (newStatus) => {
    dispatch(updateProject({ 
      id: project.id, 
      name: project.name,
      description: project.description,
      teamId: project.teamId,
      status: newStatus,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate
    }));
    setIsStatusModalOpen(false);
  };

  const canAssignTasks = project?.status !== 'completed' && currentUser?.userType === 'head';

  if (!project) {
    return (
      <div className="bg-[var(--bg-primary)] !p-6">
        <div className="text-center !py-12">
          <h2 className="text-lg font-bold text-[var(--text-primary)] !mb-4">Project Not Found</h2>
          <p className="text-[var(--text-secondary)] !mb-6">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white !px-6 !py-3 !rounded-lg font-medium"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--bg-primary)] !p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 !px-4 !py-3 !rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const todoTasks = projectTasks.filter(task => task.status === 'todo');
  const inProgressTasks = projectTasks.filter(task => task.status === 'in_progress');
  const completedTasks = projectTasks.filter(task => task.status === 'completed');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-[var(--bg-primary)] !p-6">
        {/* Header */}
        <div className="flex items-center !mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] !mr-4"
          >
            <FiArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <div className="flex items-center !gap-4 !mb-2">
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">{project.name}</h1>
              <span className={`!px-3 !py-1 !rounded-full text-xs font-medium ${getStatusColor(project.status || 'planning')}`}>
                {(project.status || 'planning').replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <p className="text-[var(--text-secondary)]">{getTeamName(project.teamId)}</p>
          </div>
          <div className="flex !gap-3">
            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="bg-[var(--text-secondary)] hover:bg-[var(--text-primary)] text-white !px-4 !py-3 !rounded-lg font-medium flex items-center !gap-2"
            >
              <FiSettings size={18} />
              Change Status
            </button>
            {canAssignTasks && (
              <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white !px-6 !py-3 !rounded-lg font-medium flex items-center !gap-2"
              >
                <FiPlus size={20} />
                Add Task
              </button>
            )}
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-[var(--bg-secondary)] !rounded-lg shadow-sm border border-[var(--border-color)] !p-6 !mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 !gap-6">
            <div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)] !mb-2">Status</h3>
              <span className={`!px-3 !py-1 !rounded-full text-xs font-medium ${getStatusColor(project.status || 'planning')}`}>
                {(project.status || 'planning').replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)] !mb-2">Priority</h3>
              <span className={`!px-3 !py-1 !rounded-full text-xs font-medium ${getPriorityColor(project.priority || 'medium')}`}>
                {project.priority.toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)] !mb-2">Start Date</h3>
              <p className="text-[var(--text-primary)]">{new Date(project.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)] !mb-2">End Date</h3>
              <p className="text-[var(--text-primary)]">{new Date(project.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="!mt-6">
            <h3 className="text-xs font-medium text-[var(--text-secondary)] !mb-2">Description</h3>
            <div className="rich-text-content">
              <div dangerouslySetInnerHTML={{ __html: project.description || '<p>No description provided</p>' }} />
            </div>
          </div>
        </div>

        {/* Task Board */}
        <div className="bg-[var(--bg-secondary)] !rounded-lg shadow-sm border border-[var(--border-color)] !p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] !mb-6">Task Board</h2>
          
          {loading ? (
            <div className="flex justify-center items-center !py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 !gap-6">
              <TaskColumn
                status="todo"
                tasks={todoTasks}
                onTaskDrop={handleTaskDrop}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onView={setViewingTask}
              />
              <TaskColumn
                status="in_progress"
                tasks={inProgressTasks}
                onTaskDrop={handleTaskDrop}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onView={setViewingTask}
              />
              <TaskColumn
                status="completed"
                tasks={completedTasks}
                onTaskDrop={handleTaskDrop}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onView={setViewingTask}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        <TaskFormModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => handleCloseModals()}
          onSubmit={handleCreateTask}
          projectId={parseInt(id)}
        />

        <TaskFormModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleEditTask}
          task={editingTask}
          projectId={parseInt(id)}
        />

            {/* Status Change Modal */}
            {isStatusModalOpen && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 !p-4">
                <div className="bg-[var(--bg-secondary)] !rounded-lg shadow-xl w-full max-w-md">
                  <div className="!p-6">
                    <div className="flex items-center justify-between !mb-6">
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">
                        Change Project Status
                      </h2>
                      <button
                        onClick={() => setIsStatusModalOpen(false)}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className="space-y-3 !mb-6">
                      <p className="text-xs text-[var(--text-secondary)] !mb-4">
                        Current status: <span className="font-medium">{(project.status || 'planning').replace('_', ' ').toUpperCase()}</span>
                      </p>
                      
                      {['planning', 'in_progress', 'completed', 'on_hold'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={status === project.status}
                          className={`w-full !px-4 !py-3 !rounded-lg text-left transition-all duration-200 ${
                            status === project.status
                              ? 'bg-[var(--bg-primary)] text-[var(--text-secondary)] cursor-not-allowed'
                              : 'hover:bg-[var(--bg-primary)] text-[var(--text-primary)]'
                          }`}
                        >
                          <span className="font-medium">{status.replace('_', ' ').toUpperCase()}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-end !gap-3">
                      <button
                        onClick={() => setIsStatusModalOpen(false)}
                        className="!px-4 !py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
      </div>

      {/* Task View Modal */}
      <TaskViewModal
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        task={viewingTask}
      />
    </DndProvider>
  );
};

export default ProjectDetails;
