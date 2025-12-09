import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Notes from "./pages/notes";
import Settings from "./pages/settings";
import Login from "./pages/auth/login";
import SingUp from "./pages/auth/signup";
import ProfileEdit from "./pages/user/EditProfile.jsx";
import Profile from "./pages/user/Profile.jsx";
import ForgetPassword from "./pages/auth/forget";
import "./App.css";
import "./styles/themes.css";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./components/Protected.js";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/signup" element={<SingUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ForgetPassword />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
