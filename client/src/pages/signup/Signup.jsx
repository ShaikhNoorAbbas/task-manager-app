import { useFormik } from "formik";
export default function Signup() {


    const initialValue = {
        name: "",
        email: "",
        password: ""
    }
    function submitHandler() {
        console.log(values)
    }
    const { values, handleChange, handleSubmit, errors, touched } = useFormik({
        initialValues: initialValue,
        onSubmit: submitHandler
    })
    return (
        <>
            <h1 className="text-center text-primary mt-5">Register User</h1>
            <section className="card shadow-lg">
                <form className="d-flex flex-column gap-4 card-body">
                    {/* username */}
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" placeholder="Enter username" id="username" className="form-control" />
                    </div>
                    {/* email */}
                    <div>
                        <label htmlFor="email">Email: </label>
                        <input type="text" placeholder="Enter Email" className="form-control" id="email" />
                    </div>
                    {/* password */}
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input type="text" placeholder="Enter password" className="form-control" id="password" />
                    </div>
                    {/* action Buttons */}
                    <div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </section>
        </>
    )
}