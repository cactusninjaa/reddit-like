import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import App from "./pages/App"
import ProfilePage from "./pages/profile/[slug]/Page";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile/:slug" element={<ProfilePage />} />
                <Route path="*" element={<App />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
