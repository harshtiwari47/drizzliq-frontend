import React from "react";
import PageLayout from "../container/layouts/general";
import "./styles/settings.css";
import "./styles/style.css";
import { CgColorBucket } from "react-icons/cg";
import { GoInfo } from "react-icons/go";
import { GrHelp } from "react-icons/gr";
import { LuShield } from "react-icons/lu";
import { TbUserEdit } from "react-icons/tb";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  const doLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {}
  };

  return (
    <PageLayout>
      <div className="pageTitle">
        <strong>SETTINGS</strong>
      </div>
      <div className="settingsMenu">
        <div className="subMenuTitle">
          <strong>General</strong>
        </div>
        <ul>
          <li>
            <CgColorBucket className="icon" /> <p>Theme</p>
            <div className="themeColor"></div>
          </li>
          <li onClick={() => navigate("/profile/edit")}>
            <TbUserEdit className="icon" /> <p>Account</p>
          </li>
        </ul>
        <div className="subMenuTitle">
          <strong>Help & Support</strong>
        </div>
        <ul>
          <li>
            <GrHelp className="icon" /> <p>Help</p>
          </li>
          <li>
            <LuShield className="icon" /> <p>Privacy</p>
          </li>
          <li>
            <GoInfo className="icon" /> <p>About</p>
          </li>
        </ul>

        <div className="subMenuTitle">
          <strong>Login</strong>
        </div>

        <ul>
          <li onClick={() => doLogout()}>
            <AiOutlineLogout className="icon" /> <p>Logout</p>
          </li>
        </ul>
      </div>
    </PageLayout>
  );
};

export default Settings;
