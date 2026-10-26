import * as Yup from "yup";


export const signupvalidationSchema = Yup.object({
    name: Yup.string().trim().required("Name is required"),
    email: Yup.string().email("Please enter Valid Email Address").required("Email is required"),
    password: Yup.string().min(6, "password must be at least 6 Characters").required("Password is required")
});

