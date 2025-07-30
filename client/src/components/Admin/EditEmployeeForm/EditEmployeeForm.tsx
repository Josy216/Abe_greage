import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import employeeService, {
  type EmployeeFormData,
} from '../../../services/employee.service';
import { useAuth } from '../../../context/AuthContext';
import type { EmployeeType } from '../../../types/employee.types';

const EditEmployeeForm: React.FC = () => {
  const { id } = useParams();
  const { employee } = useAuth();
  const employeeToken = employee?.employee_token || '';

  const [singleEmployee, setSingleEmployee] = useState<EmployeeType | null>(
    null
  );

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    roleId: 1,
    active: 1,
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await employeeService.getSingleEmployee(employeeToken, Number(id));
        const data = await res.json();

        if (data.error) {
          setServerError(data.error);
          toast.error(data.error);
        } else {
          const emp = data.data[0];
          setSingleEmployee(emp);
          setForm({
            firstName: emp.employee_first_name,
            lastName: emp.employee_last_name,
            phone: emp.employee_phone,
            roleId: Number(emp.company_role_id),
            active: emp.active_employee,
          });
        }
      } catch (err) {
        setServerError('Failed to fetch employee');
        toast.error('Failed to fetch employee');
      }
    };

    fetchEmployee();
  }, [employeeToken, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (target.checked ? 1 : 0) : value,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const formData: EmployeeFormData = {
      employee_id: singleEmployee?.employee_id ?? 0,
      employee_first_name: form.firstName,
      employee_last_name: form.lastName,
      employee_phone: form.phone,
      company_role_id: form.roleId,
      active_employee: form.active,
    };

    try {
      const res = await employeeService.updateEmployee(employeeToken, formData);
      if (res.status === 200) {
        setSuccess(true);
        toast.success('Employee updated successfully');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to update employee');
      }
    } catch (err) {
      setServerError('Failed to update employee');
      toast.error('Failed to update employee');
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>
            Edit: {singleEmployee?.employee_first_name}{' '}
            {singleEmployee?.employee_last_name}
          </h2>
          <h3>Email: {singleEmployee?.employee_email}</h3>
        </div>

        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="row clearfix">
                  {serverError && (
                    <div className="validation-error">{serverError}</div>
                  )}

                  <div className="form-group col-md-12">
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Employee first name"
                    />
                    {errors.firstName && (
                      <div className="validation-error">{errors.firstName}</div>
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
                    {errors.lastName && (
                      <div className="validation-error">{errors.lastName}</div>
                    )}
                  </div>

                  <div className="form-group col-md-12">
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Employee phone"
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
                      type="checkbox"
                      name="active"
                      checked={form.active === 1}
                      onChange={handleChange}
                      id="active"
                    />
                    <label htmlFor="active" className="ml-2">
                      Is active?
                    </label>
                  </div>

                  <div className="form-group col-md-12">
                    <button type="submit" className="theme-btn btn-style-one">
                      Update employee
                    </button>
                    {success && (
                      <p style={{ color: 'green' }}>
                        Employee updated successfully
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditEmployeeForm;
