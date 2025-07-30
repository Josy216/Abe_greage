import React, { useState } from 'react';
import customerService from '../../../services/customer.service';
import { useAuth } from '../../../context/AuthContext';
import { ScaleLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const AddCustomerForm: React.FC = () => {
  const [customer_first_name, setFirstName] = useState<string>('');
  const [customer_last_name, setLastName] = useState<string>('');
  const [customer_phone, setPhoneNumber] = useState<string>('');
  const [customer_email, setEmail] = useState<string>('');
  const [active_customer_status, setActiveCustomerStatus] = useState<number>(1);

  const [firstNameRequired, setFirstNameRequired] = useState<string>('');
  const [lastNameRequired, setLastNameRequired] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | any>('');
  const [loading, setLoading] = useState<boolean>(false);

  let token = '';
  const { employee } = useAuth();
  if (employee && employee.employee_token) {
    token = employee.employee_token;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid: boolean = true;
    if (!customer_first_name) {
      setFirstNameRequired('First name is required');
      valid = false;
    } else {
      setFirstNameRequired('');
    }
    if (!customer_last_name) {
      setLastNameRequired('Last name is required');
      valid = false;
    } else {
      setLastNameRequired('');
    }
    if (!valid) {
      return;
    }
    const formData = {
      customer_email,
      customer_phone_number: customer_phone,
      customer_first_name,
      customer_last_name,
      active_customer_status,
    };

    setLoading(true);
    customerService
      .addCustomer(token, formData)
      .then((response) => {
        if (response.ok) {
          toast.success('Customer added successfully');
          setSuccess(true);
          // Reset form
          setFirstName('');
          setLastName('');
          setPhoneNumber('');
          setEmail('');
          setActiveCustomerStatus(1);
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        } else {
          // If the response is not ok, parse the JSON to get the error message
          response.json().then((data) => {
            setServerError(data.error || 'Failed to add customer');
          });
        }
      })
      .catch((error) => {
        toast.error('Failed to add customer');
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
        setServerError(resMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a new Customer</h2>
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
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="email"
                        name="customer_email"
                        value={customer_email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Customer Email"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_first_name"
                        value={customer_first_name}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="Customer first name"
                      />
                      {firstNameRequired && (
                        <div className="validation-error" role="alert">
                          {firstNameRequired}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_last_name"
                        value={customer_last_name}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="Customer last name"
                      />
                      {lastNameRequired && (
                        <div className="validation-error" role="alert">
                          {lastNameRequired}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_phone"
                        value={customer_phone}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        placeholder="Customer phone (555-555-5555)"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="checkbox"
                        id="active"
                        checked={active_customer_status === 1}
                        onChange={() =>
                          setActiveCustomerStatus(
                            active_customer_status === 1 ? 0 : 1
                          )
                        }
                      />
                      <label htmlFor="active" className="ml-2">
                        {' '}
                        is active customer?
                      </label>
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>{loading ? <ScaleLoader color='#fff' /> : 'Add Customer'}</span>
                      </button>
                      {success && (
                        <p style={{ color: 'green' }}>
                          Customer Added successfully
                        </p>
                      )}
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

export default AddCustomerForm;
