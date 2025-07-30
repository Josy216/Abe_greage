import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import customerService from '../../../services/customer.service';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const EditCustomerForm: React.FC = () => {
  const { id } = useParams(); // Get the customer ID from the URL
  const [singleCustomer, setSingleCustomer] = useState<any>({});
  const [customer_first_name, setFirstName] = useState<string>('');
  const [customer_last_name, setLastName] = useState<string>('');
  const [customer_phone, setPhoneNumber] = useState<string>('');
  const [customer_email, setEmail] = useState<string>('');
  const [active_customer_status, setActiveCustomerStatus] = useState<number>(1);

  const [firstNameRequired, setFirstNameRequired] = useState<string>('');
  const [lastNameRequired, setLastNameRequired] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | any>('');

  let token = '';
  const { employee } = useAuth();
  if (employee && employee.employee_token) {
    token = employee.employee_token;
  }

  useEffect(() => {
    if (id) {
      customerService.getCustomerById(token, parseInt(id, 10)).then((response) => {
        if (response.data) {
          const customer = response.data.data;
          setSingleCustomer(customer);
          setFirstName(customer.customer_first_name);
          setLastName(customer.customer_last_name);
          setPhoneNumber(customer.customer_phone_number);
          setEmail(customer.customer_email);
          setActiveCustomerStatus(customer.active_customer_status);
        }
      });
    }
  }, [id, token, success]);

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

    if (id) {
      customerService
        .updateCustomer(token, parseInt(id, 10), formData)
        .then((response) => {
          if (response.ok) {
            toast.success('Customer updated successfully!');
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
            if (response.status === 404) {
              setServerError('Customer not found');
            }
            response.json().then((data) => {
              setServerError(data.error || 'Failed to update customer');
            });
          }
        })
        .catch((error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.error) ||
            error.message ||
            error.toString();
          toast.error(resMessage);
          setServerError(resMessage);
        });
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>
            Edit: {singleCustomer.customer_first_name} {singleCustomer.customer_last_name}
          </h2>
          <h5>Customer Email: {singleCustomer.customer_email}</h5>
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
                        <span>Update</span>
                      </button>
                      {success && (
                        <p style={{ color: 'green' }}>
                          Customer Updated successfully
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

export default EditCustomerForm;
