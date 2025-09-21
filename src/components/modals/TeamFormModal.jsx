import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiX, FiSave } from 'react-icons/fi';

const TeamFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialValues, 
  isEdit = false, 
  loading = false 
}) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Team name is required')
      .min(2, 'Team name must be at least 2 characters')
      .max(50, 'Team name must be less than 50 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(200, 'Description must be less than 200 characters')
  });

  const defaultValues = {
    name: '',
    description: ''
  };

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 !p-4">
      <div className="bg-[var(--bg-secondary)] !rounded-xl !p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between !mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {isEdit ? 'Edit Team' : 'Create New Team'}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        <Formik
          initialValues={initialValues || defaultValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="!space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] !mb-2">
                  Team Name
                </label>
                <Field
                  name="name"
                  type="text"
                  className={`w-full !px-4 !py-3 border rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                    errors.name && touched.name 
                      ? 'border-red-500' 
                      : 'border-[var(--border-color)]'
                  }`}
                  placeholder="Enter team name"
                />
                <ErrorMessage 
                  name="name" 
                  component="div" 
                  className="text-red-500 text-sm !mt-1" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] !mb-2">
                  Description
                </label>
                <Field
                  name="description"
                  as="textarea"
                  rows={3}
                  className={`w-full !px-4 !py-3 border rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)] resize-none ${
                    errors.description && touched.description 
                      ? 'border-red-500' 
                      : 'border-[var(--border-color)]'
                  }`}
                  placeholder="Enter team description"
                />
                <ErrorMessage 
                  name="description" 
                  component="div" 
                  className="text-red-500 text-sm !mt-1" 
                />
              </div>

              <div className="flex items-center !gap-3 !pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 !px-4 !py-3 border border-[var(--border-color)] text-[var(--text-primary)] !rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="flex-1 !px-4 !py-3 bg-[var(--accent-primary)] text-white !rounded-lg hover:bg-[var(--accent-primary)]/90 transition-colors disabled:opacity-50 flex items-center justify-center !gap-2"
                >
                  <FiSave size={16} />
                  {loading ? 'Saving...' : (isEdit ? 'Update Team' : 'Create Team')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TeamFormModal;
