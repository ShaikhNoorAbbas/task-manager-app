import { useFormik } from "formik";
import { signupvalidationSchema } from "../../schema/signupSchema";
import { Link } from "react-router-dom";
export default function Signup() {
    const initialValue = {
        name: "",
        email: "",
        password: ""
    };
    function submitHandler() {
        console.log(values);
        handleReset(initialValue);
    }
    const { values, handleChange, handleSubmit, errors, touched, handleReset, handleBlur } = useFormik({
        initialValues: initialValue,
        onSubmit: submitHandler,
        validationSchema: signupvalidationSchema
    });

    return (
        <>
            <section className="card shadow-lg p-4 mt-4">
                <h3 className="text-center mb-4">Register User</h3>
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
                        <input type="text" onChange={handleChange} name="password" onBlur={handleBlur} value={values.password} placeholder="Enter password" className={`form-control ${touched.password && errors.password ? 'is-invalid' : null}`} id="password" />
                        {touched.password && errors.password && <span className="invalid-feedback">{errors.password}</span>}
                    </div>
                    {/* action Buttons */}

                    <button type="submit" className="btn btn-primary">Submit</button>
                    <p className="text-center mt- mb-0">
                        Already have an account? <Link to="/signin">Sign in</Link>
                    </p>
                </form>
            </section>
        </>
    );
}