import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
export default function Layout() {
    return (
        <>
            <div className="container">
                <Navbar />
                <main>
                    <Outlet />
                </main>
            </div>
        </>
    )
}
