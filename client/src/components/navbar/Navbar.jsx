import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
                <Link className="navbar-brand fw-bold" to="/">
                    Task Manager
                </Link>

                <div className="ms-auto d-flex gap-3">
                    <Link className="btn btn-outline-light btn-sm" to="/signin">
                        Sign In
                    </Link>
                    <Link className="btn btn-primary btn-sm" to="/signup">
                        Sign Up
                    </Link>
                    <Link className="btn btn-success btn-sm" to="/dashboard">
                        Dashboard
                    </Link>
                </div>
            </nav>
        </>
    );
}