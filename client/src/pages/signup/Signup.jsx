import { useFormik } from "formik";
import { signupvalidationSchema } from "../../schema/signupSchema";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useState } from "react";


export default function Signup() {

    const navigate = useNavigate();

    const [serverError, setServerError] = useState('');

    const [loading, setLoading] = useState(false);

    const initialValue = {
        name: "",
        email: "",
        password: ""
    };
    async function submitHandler() {
        try {
            setServerError("");
            // Send data to Express
            const response = await api.post("/api/auth/signup", values);
            if (response.data.success) {
                alert("Account Created Successfully! Please Signin");
                navigate('/signin');
            }
        } catch (error) {
            const message = error.response.data.message || 'Something Went Wrong';

            setServerError(message);
        } finally {
            setLoading(false);
            handleReset(initialValue);
        }
    }
    const { values, handleChange, handleSubmit, errors, touched, handleReset, handleBlur } = useFormik({
        initialValues: initialValue,
        onSubmit: submitHandler,
        validationSchema: signupvalidationSchema
    });

    return (
        <>
            <section className="row justify-content-center  mt-4">
                <div className="col-md-5 card shadow-lg p-4 ">
                    <h3 className="text-center mb-4">Create an Account</h3>

                    {/* Display Backend Error Alert if any */}
                    {serverError && (
                        <div className="alert alert-danger py-2">{serverError}</div>
                    )}
                    <form onSubmit={handleSubmit} autoComplete="off" className="d-flex flex-column gap-4 card-body ">
                        {/* username */}
                        <div>
                            <label htmlFor="username">Username</label>
                            <input value={values.name} onChange={handleChange} onBlur={handleBlur} className={`form-control ${touched.name && errors.name ? 'is-invalid' : null}`} type="text" placeholder="Enter username" id="username" name="name" />
                            {touched.name && errors.name && <span className="invalid-feedback">{errors.name}</span>}
                        </div>
                        {/* email */}
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input type="text" onChange={handleChange} name="email" onBlur={handleBlur} value={values.email} placeholder="Enter Email" id="email" className={`form-control ${touched.email && errors.email ? 'is-invalid' : null}`} />
                            {touched.email && errors.email && <span className="invalid-feedback">{errors.email}</span>}
                        </div>
                        {/* password */}
                        <div>
                            <label htmlFor="password">Password: </label>
                            <input type="password" onChange={handleChange} name="password" onBlur={handleBlur} value={values.password} placeholder="Enter password" className={`form-control ${touched.password && errors.password ? 'is-invalid' : null}`} id="password" />
                            {touched.password && errors.password && <span className="invalid-feedback">{errors.password}</span>}
                        </div>
                        {/* action Buttons */}

                        <button disabled={loading} type="submit" className="btn btn-primary">
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                        <p className="text-center mt- mb-0">
                            Already have an account? <Link to="/signin">Sign in</Link>
                        </p>
                    </form>
                </div>
            </section>
        </>
    );
}