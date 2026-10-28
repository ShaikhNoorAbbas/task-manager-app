import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useState } from "react";
const Signin = () => {
    // state to manage errors and loading state
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    // 1. Yup Rulebook for Login
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Please enter a valid email address")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required"),
    });

    // 2. Formik Clipboard Manager
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {

            try {
                setServerError("")
                setLoading(true)
                console.log("Signin Form Data:", values);

                const response = await api.post("/api/auth/signin", values)
                if (response.data.success) {
                    localStorage.setItem("token", response.data.token)
                    localStorage.setItem("user", JSON.stringify(response.data.user))
                    // Navigating to dashboard
                    navigate('/dashboard')
                }

            } catch (error) {
                const message =
                    error.response?.data?.message || "Login failed. Please try again.";
                setServerError(message);
            } finally {
                formik.handleReset();
                setLoading(false)
            }

        },
    });

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-5">
                <div className="card shadow-lg p-4">
                    <h3 className="text-center mb-4">Sign In</h3>
                    {serverError && (
                        <div className="alert alert-danger py-2">{serverError}</div>
                    )}
                    <form className="card-body" onSubmit={formik.handleSubmit}>
                        {/* Email Field */}
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""
                                    }`}
                                placeholder="Enter your email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="invalid-feedback">{formik.errors.email}</div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className={`form-control ${formik.touched.password && formik.errors.password
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                placeholder="Enter your password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="invalid-feedback">{formik.errors.password}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button disabled={loading} type="submit" className="btn btn-success w-100 mt-2">
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center mt-3 mb-0">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signin;