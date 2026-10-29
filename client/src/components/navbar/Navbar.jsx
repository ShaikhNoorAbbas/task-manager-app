import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();


    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
                <Link className="navbar-brand fw-bold" to={token ? '/dashboard' : "/signin"}>
                    Task Manager
                </Link>

                <div className="ms-auto d-flex align-items-center gap-3">
                    {token ? (
                        <>
                            {user && (
                                <span className="text-light small">
                                    Welcome, <strong>{user.name}</strong>
                                </span>
                            )}
                            <Link className="btn btn-success btn-sm" to="/dashboard">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="btn btn-danger btn-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="btn btn-outline-light btn-sm" to="/signin">
                                Sign In
                            </Link>
                            <Link className="btn btn-primary btn-sm" to="/signup">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}