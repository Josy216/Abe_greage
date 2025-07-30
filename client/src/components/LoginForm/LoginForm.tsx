import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logIn } from '../../services/login.service';
import { useAuth } from '../../context/AuthContext';
import { ScaleLoader } from 'react-spinners';

const LoginForm: React.FC = () => {
  const [employee_email, setEmail] = useState<string>('');
  const [employee_password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { setIsLogged, setIsAdmin, setEmployee } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setServerError('');

    // Validation
    let isValid = true;
    
    // Email validation
    if (!employee_email) {
      setEmailError('Please enter your email address');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(employee_email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Password validation
    if (!employee_password) {
      setPasswordError('Please enter your password');
      isValid = false;
    } else if (employee_password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }
    
    if (!isValid) return;

    try {
      setLoading(true);
      const response = await logIn({ employee_email, employee_password });
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        // Save to local storage
        localStorage.setItem('employee', JSON.stringify(data.data));
        
        // Update auth context
        setIsLogged(true);
        setEmployee(data.data);
        
        // Check if admin
        const isAdmin = data.data.employee_role === 3;
        setIsAdmin(isAdmin);
        
        // Redirect based on role
        navigate(isAdmin ? '/admin' : '/', { replace: true });
        
        // Force reload to ensure all components update
        window.location.reload();
      } else {
        setServerError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="contact-section overflow-hidden"
      style={{ maxWidth: '95%', margin: '0 auto' }}
    >
      <div className="auto-container">
        <div className="contact-title">
          <h2>Login to your account</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      {serverError && (
                        <div className="validation-error" role="alert">
                          {serverError}
                        </div>
                      )}
                      <input
                        type="email"
                        name="employee_email"
                        value={employee_email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email"
                      />
                      {emailError && (
                        <div className="validation-error" role="alert">
                          {emailError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="password"
                        name="employee_password"
                        value={employee_password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                      />
                      {passwordError && (
                        <div className="validation-error" role="alert">
                          {passwordError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>{loading ? <ScaleLoader color="#fff" /> : 'Login'}</span>
                      </button>
                    </div>

                    <div className="form-group col-md-12 text-center mt-3">
                      <div>
                        <p><strong>Demo Admin Account:{' '}</strong></p>
                        <p>Email: <code>Admin@example.com{' '}</code></p>
                        <p>Password: <code>admin1234{' '}</code></p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
