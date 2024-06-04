import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const disabilityTypes = {
  OH: "Locomotor disability (includes: cerebral palsy, leprosy cured, dwarfism, etc.)",
  HH: "Deaf and hard of hearing",
  VH: "Blindness and low vision",
  Others: "Multiple disabilities (includes: autism, intellectual disability, mental illness, etc.)"
};

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = (props) => {

  const notify = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  const [hasDisability, setHasDisability] = useState(false);
  const [submittedForm, setSubmittedForm] = useState(false);

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setSubmittedForm(false);
  };

  const handleFlush = () => {
    setUser({
      email: '',
      password: '',
    });
    setHasDisability(false);
    console.log("Flushed");
  };

  const validateForm = useCallback(() => {
    const { email, password } = user;

    if (!email || !password) {
      return "Please fill in all fields.";
    }
    if (!email.match(emailPattern)) {
      return "Please enter a valid email.";
    }
    return null;
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMessage = validateForm();

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(response => {
        if (!response.error) {
          handleFlush()
          notifySuccess("Sign-up Successful")
        } else {
          notify(response.error);
          notify("Try using different Email")
        }
      })
      .catch(error => {
        notify("An error occurred while submitting the form.");
      });
  };


  useEffect(() => {
    const errorMessage = validateForm()
    if (!errorMessage) {
      setSubmittedForm(true)
    }
    else {
      setSubmittedForm(false)
    }
  }, [validateForm]);

  return (
    <form noValidate>
      <div className="modal-body bg-dark">
        <label htmlFor="email" className="form-label">Email</label>
        <div>
          <input type="email" value={user.email} name='email' className="form-control" id="email" aria-describedby="inputGroupPrepend" required onChange={handleChange} />
          {
            (user.email.match(emailPattern) || user.email === '') ? '' : <div className="text-danger">Please enter a valid email.</div>
          }
        </div>
        <div>
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" value={user.password} name='password' className="form-control" id="password" required onChange={handleChange} />
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-link" onClick={() => { props.setAlreadyUser(false) }}>Create an Account?</button>
        <button onClick={handleSubmit} className="btn btn-success" data-bs-dismiss={submittedForm ? "modal" : ""}>Done</button>
      </div>
    </form>
  )
}

export default Login;
