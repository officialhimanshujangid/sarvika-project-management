import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiX, FiSave, FiUser, FiMail, FiKey, FiUsers } from 'react-icons/fi';

const EmployeeFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialValues, 
  isEdit = false, 
  loading = false,
  teams = []
}) => {
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    name: Yup.string()
      .required('Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    ...(isEdit ? {} : {
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
    }),
    userType: Yup.string()
      .required('User type is required')
      .oneOf(['employee', 'head'], 'Invalid user type')
      .default('employee'),
    teamId: Yup.string()
      .nullable()
      .transform((value) => value === '' ? null : value)
  });

  const defaultValues = {
    username: '',
    name: '',
    email: '',
    ...(isEdit ? {} : { password: '' }),
    userType: 'employee',
    teamId: ''
  };

  // Process initial values to ensure select fields have proper string values
  const processedInitialValues = initialValues ? {
    ...initialValues,
    userType: initialValues.userType || 'employee',
    teamId: initialValues.teamId ? String(initialValues.teamId) : '',
    username: initialValues.username || '',
    name: initialValues.name || '',
    email: initialValues.email || '',
    // Ensure password is handled properly for edit mode
    ...(isEdit ? {} : { password: initialValues.password || '' })
  } : defaultValues;

  // Additional safety check to ensure no null values
  const safeInitialValues = Object.keys(processedInitialValues).reduce((acc, key) => {
    acc[key] = processedInitialValues[key] === null ? '' : processedInitialValues[key];
    return acc;
  }, {});

  const handleSubmit = (values, { setSubmitting }) => {
    // Convert teamId string to number or null
    const processedValues = {
      ...values,
      teamId: values.teamId && values.teamId !== '' ? parseInt(values.teamId) : null
    };

    // For edit mode, don't include password in the submission
    if (isEdit) {
      const { password: _password, ...valuesWithoutPassword } = processedValues;
      onSubmit(valuesWithoutPassword);
    } else {
      onSubmit(processedValues);
    }
    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] !p-4">
      <div className="bg-[var(--bg-secondary)] !rounded-xl !p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between !mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {isEdit ? 'Edit Employee' : 'Create New Employee'}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <Formik
          initialValues={safeInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnMount={false}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="!space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 !gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] !mb-2">
                    <FiUser className="inline !mr-2" size={16} />
                    Username
                  </label>
                  <Field
                    name="username"
                    type="text"
                    className={`w-full !px-4 !py-3 border rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                      errors.username && touched.username 
                        ? 'border-red-500' 
                        : 'border-[var(--border-color)]'
                    }`}
                    placeholder="Enter username"
                  />
                  <ErrorMessage 
                    name="username" 
                    component="div" 
                    className="text-red-500 text-xs !mt-1" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] !mb-2">
                    <FiUser className="inline !mr-2" size={16} />
                    Full Name
                  </label>
                  <Field
                    name="name"
                    type="text"
                    className={`w-full !px-4 !py-3 border rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                      errors.name && touched.name 
                        ? 'border-red-500' 
                        : 'border-[var(--border-color)]'
                    }`}
                    placeholder="Enter full name"
                  />
                  <ErrorMessage 
                    name="name" 
                    component="div" 
                    className="text-red-500 text-xs !mt-1" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] !mb-2">
                    <FiMail className="inline !mr-2" size={16} />
                  Email Address
                </label>
                <Field
                  name="email"
                  type="email"
                  className={`w-full !px-4 !py-3 border rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                    errors.email && touched.email 
                      ? 'border-red-500' 
                      : 'border-[var(--border-color)]'
                  }`}
                  placeholder="Enter email address"
                />
                <ErrorMessage 
                  name="email" 
                  component="div" 
                  className="text-red-500 text-xs mt-1" 
                />
              </div>

              {!isEdit && (
                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] !mb-2">
                      <FiKey className="inline !mr-2" size={16} />
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className={`w-full !px-4 !py-3 border rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                      errors.password && touched.password 
                        ? 'border-red-500' 
                        : 'border-[var(--border-color)]'
                    }`}
                    placeholder="Enter password"
                  />
                  <ErrorMessage 
                    name="password" 
                    component="div" 
                    className="text-red-500 text-xs !mt-1" 
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 !gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] !mb-2">
                    User Type
                  </label>
                  <Field
                    name="userType"
                    as="select"
                    className={`w-full !px-4 !py-3 border rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                      errors.userType && touched.userType 
                        ? 'border-red-500' 
                        : 'border-[var(--border-color)]'
                    }`}
                  >
                    <option value="employee">Employee</option>
                    <option value="head">Team Head</option>
                  </Field>
                  <ErrorMessage 
                    name="userType" 
                    component="div" 
                    className="text-red-500 text-xs !mt-1" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] !mb-2">
                    <FiUsers className="inline !mr-2" size={16} />
                    Assign to Team
                  </label>
                  <Field
                    name="teamId"
                    as="select"
                    className={`w-full !px-4 !py-3 border rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                      errors.teamId && touched.teamId 
                        ? 'border-red-500' 
                        : 'border-[var(--border-color)]'
                    }`}
                  >
                    <option value="">Select a team (optional)</option>
                    {teams?.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage 
                    name="teamId" 
                    component="div" 
                    className="text-red-500 text-xs !mt-1" 
                  />
                </div>
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
                  {loading ? 'Saving...' : (isEdit ? 'Update Employee' : 'Create Employee')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
