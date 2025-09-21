import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactQuillWrapper from '../ReactQuillWrapper';
import { FiX, FiSave, FiCalendar, FiUsers, FiFlag, FiFileText } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const ProjectFormModal = ({ isOpen, onClose, onSubmit, project = null }) => {
  const { teams } = useSelector(state => state.teams);
  const { currentUser } = useSelector(state => state.auth);
  const [description, setDescription] = useState('');

  const isEdit = !!project;

  useEffect(() => {
    if (isEdit && project) {
      setDescription(project.description || '');
    } else {
      setDescription('');
    }
  }, [isEdit, project]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Project name is required')
      .min(3, 'Project name must be at least 3 characters')
      .max(100, 'Project name must be less than 100 characters'),
    teamId: Yup.string()
      .required('Please select a team'),
    priority: Yup.string()
      .required('Please select priority'),
    startDate: Yup.date()
      .required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date')
  });

  const defaultValues = {
    name: project?.name || '',
    teamId: project?.teamId?.toString() || '',
    priority: project?.priority || 'medium',
    startDate: project?.startDate || '',
    endDate: project?.endDate || ''
  };

  const handleSubmit = (values) => {
    const formData = {
      ...values,
      description,
      teamId: parseInt(values.teamId)
    };
    onSubmit(formData);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  if (!isOpen) return null;

  // Check if user has permission to create/edit projects
  if (currentUser?.userType !== 'head') {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 !p-4">
        <div className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-md">
          <div className="!p-6 text-center">
            <div className="!mb-4">
              <div className="mx-auto h-16 w-16 bg-red-100 !rounded-full flex items-center justify-center !mb-4">
                <FiX className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] !mb-2">Access Denied</h2>
              <p className="text-[var(--text-secondary)] !mb-6">
                Only administrators can create or edit projects.
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
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 !p-4">
        <div className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="!p-6">
            <div className="flex items-center justify-between !mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                {isEdit ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button
                onClick={onClose}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <FiX size={24} />
              </button>
            </div>

          <Formik
            initialValues={defaultValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 !gap-6">
                  {/* Project Name */}
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] !mb-2">
                          <FiFileText className="inline !mr-2" />
                          Project Name *
                        </label>
                        <Field
                          type="text"
                          name="name"
                          className="w-full !px-4 !py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                          placeholder="Enter project name"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm !mt-1" />
                      </div>

                  {/* Team Selection */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] !mb-2">
                      <FiUsers className="inline !mr-2" />
                      Team *
                    </label>
                    <Field
                      as="select"
                      name="teamId"
                      className="w-full !px-4 !py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="">Select a team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="teamId" component="div" className="text-red-500 text-sm !mt-1" />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] !mb-2">
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
                    <ErrorMessage name="priority" component="div" className="text-red-500 text-sm !mt-1" />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] !mb-2">
                      <FiCalendar className="inline !mr-2" />
                      Start Date *
                    </label>
                    <Field
                      type="date"
                      name="startDate"
                      className="w-full !px-4 !py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    />
                    <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm !mt-1" />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] !mb-2">
                      <FiCalendar className="inline !mr-2" />
                      End Date *
                    </label>
                    <Field
                      type="date"
                      name="endDate"
                      className="w-full !px-4 !py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    />
                    <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm !mt-1" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] !mb-2">
                    <FiFileText className="inline !mr-2" />
                    Description
                  </label>
                  <div className="border border-[var(--border-color)] rounded-lg">
                    <ReactQuillWrapper
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      modules={quillModules}
                      className="bg-[var(--bg-primary)]"
                      style={{ minHeight: '200px' }}
                    />
                  </div>
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
                    disabled={isSubmitting}
                    className="!px-6 !py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center !gap-2"
                  >
                    <FiSave size={18} />
                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
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

export default ProjectFormModal;
