import React, { useState } from 'react';
import employeeService from '../../../services/employee.service';
import { useAuth } from '../../../context/AuthContext';
import { ScaleLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const AddEmployeeForm: React.FC = () => {
  const { employee } = useAuth();
  const employeeToken = employee?.employee_token || '';

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    active: 1,
    roleId: 1,
  });

  const [errors, setErrors] = useState<{
    email?: string;
    firstName?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'roleId' ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email))
      newErrors.email = 'Invalid email format';
    if (!form.password || form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      active: 1,
      roleId: 1,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await employeeService.createEmployee(
        {
          employee_email: form.email,
          employee_first_name: form.firstName,
          employee_last_name: form.lastName,
          employee_phone: form.phone,
          employee_password: form.password,
          active_employee: form.active,
          company_role_id: form.roleId,
        },
        employeeToken
      );

      const data = await response.json();

      if (data.error) {
        setServerError(data.error);
      } else {
        toast.success('Employee added successfully');
        setSuccess(true);
        resetForm();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error: any) {
      setServerError(error.message || 'An unexpected error occurred');
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a new employee</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    {serverError && (
                      <div className="validation-error">{serverError}</div>
                    )}

                    <div className="form-group col-md-12">
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Employee email"
                      />
                      {errors.email && (
                        <div className="validation-error">{errors.email}</div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Employee first name"
                      />
                      {errors.firstName && (
                        <div className="validation-error">
                          {errors.firstName}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Employee last name"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Employee phone (555-555-5555)"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <select
                        name="roleId"
                        value={form.roleId}
                        onChange={handleChange}
                        className="custom-select-box"
                      >
                        <option value={1}>Employee</option>
                        <option value={2}>Manager</option>
                        <option value={3}>Admin</option>
                      </select>
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Employee password"
                      />
                      {errors.password && (
                        <div className="validation-error">
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <button className="theme-btn btn-style-one" type="submit">
                        <span>
                          {loading ? (
                            <ScaleLoader color="#fff" />
                          ) : (
                            'Add employee'
                          )}
                        </span>
                      </button>
                    </div>

                    {success && (
                      <p style={{ color: 'green' }}>
                        Employee added successfully
                      </p>
                    )}
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

export default AddEmployeeForm;
