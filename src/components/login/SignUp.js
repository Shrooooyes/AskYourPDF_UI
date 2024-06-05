import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';

const disabilityTypes = {
    OH: "Locomotor disability (includes: cerebral palsy, leprosy cured, dwarfism, etc.)",
    HH: "Deaf and hard of hearing",
    VH: "Blindness and low vision",
    Others: "Multiple disabilities (includes: autism, intellectual disability, mental illness, etc.)"
};

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignUp = (props) => {

    //props
    const handleProps_User = (userDetails, chat) => {
        props.setUser({
            "userData": userDetails,
            "chats": chat
        })
    }

    const notify = (message) => toast.error(message);
    const notifySuccess = (message) => toast.success(message);

    const [alreadyUser, setAlreadyUser] = useState(false);
    const [hasDisability, setHasDisability] = useState(false);
    const [disabilityType, setDisabilityType] = useState('');
    const [submittedForm, setSubmittedForm] = useState(false);

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        disability: 'none'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
        if (name === 'disability') {
            setDisabilityType(disabilityTypes[value] || '');
        }
        setSubmittedForm(false);
    };

    const handleFlush = () => {
        setUser({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            disability: 'none'
        });
        setHasDisability(false);
        setDisabilityType('');
        console.log("Flushed");
    };

    const validateForm = useCallback(() => {
        const { firstName, lastName, email, password, confirmPassword, disability } = user;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return "Please fill in all fields.";
        }
        if (hasDisability && disability === 'none') {
            return "Please select a type of disability.";
        }
        if (!email.match(emailPattern)) {
            return "Please enter a valid email.";
        }
        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }
        return null;
    }, [user, hasDisability]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errorMessage = validateForm();

        if (errorMessage) {
            alert(errorMessage);
            return;
        }

        fetch('http://localhost:8000/add-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    handleFlush()
                    notifySuccess("Sign-up Successful")
                    // console.log(response.user)
                    handleProps_User(response, 'xyz')
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
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog m-auto">
                <div className="signup-modal modal-content">
                    <div className="modal-header">
                        <h1 className="signup-modal-header modal-title fs-5 p-2 position-absolute w-100" id="staticBackdropLabel">AskYourPDF</h1>
                        <button type="button" onClick={handleFlush} className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    {
                        alreadyUser ?
                            <Login setAlreadyUser={setAlreadyUser} setUser={props.setUser} />
                            :
                            <form noValidate>
                                <div className="modal-body bg-dark">
                                    <div className='user-name'>
                                        <div>
                                            <label htmlFor="firstName" className="form-label">First name</label>
                                            <input type="text" value={user.firstName} name='firstName' className="form-control" id="firstName" required onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="form-label">Last name</label>
                                            <input type="text" value={user.lastName} name='lastName' className="form-control" id="lastName" required onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <div>
                                            <input type="email" value={user.email} name='email' className="form-control" id="email" aria-describedby="inputGroupPrepend" required onChange={handleChange} />
                                            {
                                                (user.email.match(emailPattern) || user.email === '') ? '' : <div className="text-danger">Please enter a valid email.</div>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" value={user.password} name='password' className="form-control" id="password" required onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <input type="password" value={user.confirmPassword} name='confirmPassword' className="form-control" id="confirmPassword" required onChange={handleChange} />
                                        {
                                            (user.password === user.confirmPassword || user.confirmPassword === '') ? <></> : <span className='text-danger'>Passwords do not match</span>
                                        }
                                    </div>
                                    <div>
                                        <div className="form-check">
                                            <input className="form-check-input" checked={hasDisability} onChange={() => setHasDisability(!hasDisability)} type="checkbox" id="invalidCheck" />
                                            <label className="form-check-label" htmlFor="invalidCheck">
                                                Person with Benchmark Disability (PwBD)?
                                            </label>
                                        </div>
                                    </div>
                                    {hasDisability && (
                                        <div>
                                            <select name='disability' onChange={handleChange} value={user.disability} className="form-select" aria-label="Default select example" required>
                                                <option value="none" disabled>Type of Disability</option>
                                                {Object.keys(disabilityTypes).map((key) => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                            <strong className='text-success'>{disabilityType}</strong>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-link" onClick={() => setAlreadyUser(true)}>Already a user?</button>
                                    <button onClick={handleSubmit} className="btn btn-success" data-bs-dismiss={submittedForm ? "modal" : ""}>Done</button>
                                </div>
                            </form>
                    }
                </div>
            </div>
        </div>
    );
};

export default SignUp;