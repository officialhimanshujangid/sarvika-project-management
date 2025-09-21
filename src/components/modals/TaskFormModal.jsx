import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiX, FiSave, FiCalendar, FiUser, FiFlag, FiFileText } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import ReactQuillWrapper from '../ReactQuillWrapper';

const TaskFormModal = ({ isOpen, onClose, onSubmit, task = null, projectId = null }) => {
  const { users, currentUser } = useSelector(state => state.auth);
  const { projects } = useSelector(state => state.projects);
  const [description, setDescription] = useState('');

  const isEdit = !!task;

  useEffect(() => {
    if (isEdit && task) {
      setDescription(task.description || '');
    } else {
      setDescription('');
    }
  }, [isEdit, task]);

  // Get team members for the project
  const getTeamMembers = () => {
    if (!projectId) return [];
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    return users.filter(user => user.teamId === project.teamId);
  };

  const teamMembers = getTeamMembers();
  const project = projects.find(p => p.id === projectId);
  const isProjectCompleted = project?.status === 'completed';

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Task title is required')
      .min(3, 'Task title must be at least 3 characters')
      .max(200, 'Task title must be less than 200 characters'),
    assignedTo: Yup.string()
      .required('Please assign the task to a team member'),
    priority: Yup.string()
      .required('Please select priority'),
    dueDate: Yup.date()
      .required('Due date is required')
      // Allow past dates when editing existing tasks
      .test('not-empty', 'Due date is required', value => value != null)
  });

  const defaultValues = {
    title: task?.title || '',
    assignedTo: task?.assignedTo?.toString() || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate || ''
  };

  const handleSubmit = (values) => {
    if (isProjectCompleted && !isEdit) {
      return; // Don't allow creating new tasks for completed projects
    }

    const formData = {
      ...values,
      description,
      projectId: projectId || task?.projectId,
      assignedTo: parseInt(values.assignedTo)
    };
    onSubmit(formData);
  };

  if (!isOpen) return null;

  // Check if user has permission to create/edit tasks
  if (currentUser?.userType !== 'head') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 !p-4">
        <div className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-md">
          <div className="!p-6 text-center">
            <div className="!mb-4">
              <div className="mx-auto h-16 w-16 bg-red-100 !rounded-full flex items-center justify-center !mb-4">
                <FiX className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] !mb-2">Access Denied</h2>
              <p className="text-[var(--text-secondary)] !mb-6">
                Only administrators can create or edit tasks.
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white !px-6 !py-3 !rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 !p-4">
        <div className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="!p-6">
            <div className="flex items-center justify-between !mb-6">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                {isEdit ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={onClose}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <FiX size={24} />
              </button>
            </div>

          {isProjectCompleted && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 !px-4 !py-3 !rounded-lg !mb-6">
              <p className="text-xs font-medium">
                ⚠️ This project is completed. You cannot create new tasks for completed projects.
              </p>
            </div>
          )}

          <Formik
            initialValues={defaultValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                    {/* Task Title */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] !mb-2">
                        <FiFileText className="inline !mr-2" />
                        Task Title *
                      </label>
                      <Field
                        type="text"
                        name="title"
                        className="w-full !px-4 !py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                        placeholder="Enter task title"
                      />
                      <ErrorMessage name="title" component="div" className="text-red-500 text-xs !mt-1" />
                    </div>

                    {/* Task Description */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] !mb-2">
                        <FiFileText className="inline !mr-2" />
                        Description
                      </label>
                      <div className="border border-[var(--border-color)] rounded-lg">
                        <ReactQuillWrapper
                          theme="snow"
                          value={description}
                          onChange={setDescription}
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              [{ 'color': [] }, { 'background': [] }],
                              ['link'],
                              ['clean']
                            ],
                          }}
                          className="bg-[var(--bg-primary)]"
                          style={{ minHeight: '150px' }}
                        />
                      </div>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-2 !gap-6">
                  {/* Assigned To */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] !mb-2">
                      <FiUser className="inline !mr-2" />
                      Assign To *
                    </label>
                    <Field
                      as="select"
                      name="assignedTo"
                      className="w-full !px-4 !py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="">Select team member</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.email})
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="assignedTo" component="div" className="text-red-500 text-xs !mt-1" />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] !mb-2">
                      <FiFlag className="inline !mr-2" />
                      Priority *
                    </label>
                    <Field
                      as="select"
                      name="priority"
                      className="w-full !px-4 !py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Field>
                    <ErrorMessage name="priority" component="div" className="text-red-500 text-xs !mt-1" />
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] !mb-2">
                    <FiCalendar className="inline !mr-2" />
                    Due Date *
                  </label>
                  <Field
                    type="date"
                    name="dueDate"
                    className="w-full !px-4 !py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  />
                  <ErrorMessage name="dueDate" component="div" className="text-red-500 text-xs !mt-1" />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end !gap-3 !pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="!px-6 !py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (isProjectCompleted && !isEdit)}
                    className="!px-6 !py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center !gap-2"
                  >
                    <FiSave size={18} />
                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
