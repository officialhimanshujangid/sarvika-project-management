import { Formik, Form, Field } from 'formik';
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { login, forgotPassword, clearError } from '../redux/redux_slices/authSlice';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordModal } from '../components/modals';


const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated, error } = useSelector(state => state.auth)
  const resetFormRef = useRef(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
            if (resetFormRef.current) {
        resetFormRef.current();
        resetFormRef.current = null; 
      }

    }
  }, [isAuthenticated , navigate])

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'User ID is required';
    } else if (values.username.length < 3) {
      errors.username = 'User ID must be at least 3 characters';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleSubmit = (values,{resetForm}) => {
    resetFormRef.current = resetForm;
    dispatch(login(values))
  };

  const handleForgotPassword = ({ email, newPassword }) => {
    dispatch(forgotPassword({ email, newPassword }));
  };


  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Clear error when forgot password modal opens
  useEffect(() => {
    if (isForgotPasswordOpen && error) {
      dispatch(clearError());
    }
  }, [isForgotPasswordOpen, error, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 !py-12 !px-4 sm:!px-6 lg:!px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="!p-8">
          <div className="text-center">
            <div className="!mx-auto h-16 w-16 bg-indigo-600 !rounded-full flex items-center justify-center !mb-6">
              <FaUser className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 !mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 !mb-8">
              Sign in to access your account
            </p>
          </div>

          <Formik
            initialValues={{ username: '', password: '' }}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ errors, touched}) => (
              <Form className="!space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 !mb-1">
                    User ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 !pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      className={`w-full !pl-10 !pr-4 !py-3 !rounded-lg border focus:outline-none focus:ring-2 transition-colors ${errors.username && touched.username
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                      placeholder="Enter your user ID"
                    />
                  </div>
                  {errors.username && touched.username && (
                    <div className="!mt-1 text-sm text-red-600">{errors.username}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 !mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 !pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full !pl-10 !pr-12 !py-3 !rounded-lg border focus:outline-none focus:ring-2 transition-colors ${errors.password && touched.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 !pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <div className="!mt-1 text-sm text-red-600">{errors.password}</div>
                  )}
                </div>
                
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center   !py-3 !px-4 !border border-transparent !rounded-lg shadow-sm text-sm font-medium text-white 
                      ${loading
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      } transition-colors`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin !-ml-1 !mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="!mr-2" />
                        Sign in
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Demo Credentials Section */}
          <div className="!mt-8 !pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 !mb-4 text-center">Demo Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 !gap-4">
              {/* Employee Demo */}
              <div 
                className="bg-blue-50 !p-4 !rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
               
              >
                <div className="flex items-center !mb-2">
                  <div className="h-8 w-8 bg-blue-500 !rounded-full flex items-center justify-center !mr-3">
                    <FaUser className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-900">Employee Demo</h4>
                </div>
                <div className="!space-y-2">
                  <div>
                    <span className="text-sm font-medium text-blue-700">User ID:</span>
                    <span className="text-sm text-blue-900 !ml-2 font-mono bg-blue-100 !px-2 !py-1 !rounded">jsmith</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-700">Password:</span>
                    <span className="text-sm text-blue-900 !ml-2 font-mono bg-blue-100 !px-2 !py-1 !rounded">jsmith2024</span>
                  </div>
                 
                </div>
              </div>

              {/* Head Demo */}
              <div 
                className="bg-green-50 !p-4 !rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
               
              >
                <div className="flex items-center !mb-2">
                  <div className="h-8 w-8 bg-green-500 !rounded-full flex items-center justify-center !mr-3">
                    <FaUser className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-green-900">Head/Admin Demo</h4>
                </div>
                <div className="!space-y-2">
                  <div>
                    <span className="text-sm font-medium text-green-700">User ID:</span>
                    <span className="text-sm text-green-900 !ml-2 font-mono bg-green-100 !px-2 !py-1 !rounded">admin</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-green-700">Password:</span>
                    <span className="text-sm text-green-900 !ml-2 font-mono bg-green-100 !px-2 !py-1 !rounded">admin123</span>
                  </div>
                
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onSubmit={handleForgotPassword}
        error={error}
        loading={loading}
      />
    </div>
  );
};

export default Login;