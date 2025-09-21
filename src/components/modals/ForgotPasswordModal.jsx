import React, { useState, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiX, FiMail, FiKey, FiAlertCircle } from 'react-icons/fi';

const ForgotPasswordModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  error = null,
  loading = false
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters')
  });

  const handleClose = useCallback(() => {
    setHasSubmitted(false);
    onClose();
  }, [onClose]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setHasSubmitted(true);
    try {
      await onSubmit({ email: values.email, newPassword: values.newPassword });
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Close modal on successful password reset
  React.useEffect(() => {
    if (!error && !loading && hasSubmitted && isOpen) {
      // Close the modal after successful password reset
      const timer = setTimeout(() => {
        handleClose();
      }, 1000); // Small delay to ensure toast is visible
      return () => clearTimeout(timer);
    }
  }, [error, loading, hasSubmitted, isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] !p-4">
      <div className="bg-[var(--bg-secondary)] !rounded-xl !p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between !mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Reset Password
          </h2>
          <button
            onClick={handleClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <Formik
          initialValues={{ email: '', newPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="space-y-6">
                <div>
                  <p className="text-[var(--text-secondary)] !mb-4">
                    Enter your email address and new password to reset your account password.
                  </p>
                  {error && (
                    <div className="!mb-4 !p-3 bg-red-100 border border-red-400 text-red-700 !rounded-lg flex items-center !gap-2">
                      <FiAlertCircle size={16} />
                      <span className="text-xs">{error}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] !mb-2">
                    <FiMail className="inline !mr-2" size={16} />
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className={`w-full !px-4 !py-3 border !rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                      errors.email && touched.email 
                        ? 'border-red-500' 
                        : 'border-[var(--border-color)]'
                    }`}
                    placeholder="Enter your email address"
                  />
                  <ErrorMessage 
                    name="email" 
                    component="div" 
                    className="text-red-500 text-xs !mt-1" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] !mb-2">
                    <FiKey className="inline !mr-2" size={16} />
                    New Password
                  </label>
                  <Field
                    name="newPassword"
                    type="password"
                    className={`w-full !px-4 !py-3 border !rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                      errors.newPassword && touched.newPassword 
                        ? 'border-red-500' 
                        : 'border-[var(--border-color)]'
                    }`}
                    placeholder="Enter new password"
                  />
                  <ErrorMessage 
                    name="newPassword" 
                    component="div" 
                    className="text-red-500 text-xs !mt-1" 
                  />
                </div>
              </div>

              <div className="flex items-center !gap-3 !pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 !px-4 !py-3 border border-[var(--border-color)] text-[var(--text-primary)] !rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="flex-1 !px-4 !py-3 bg-[var(--accent-primary)] text-white !rounded-lg hover:bg-[var(--accent-primary)]/90 transition-colors disabled:opacity-50 flex items-center justify-center !gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
