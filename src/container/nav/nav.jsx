import React from "react";
import "./style.css";
import { GoHome, GoSearch } from "react-icons/go";
import { ImCompass2 } from "react-icons/im";
import { LuFolder } from "react-icons/lu";
import { TbNotebook } from "react-icons/tb";
import { SlUser } from "react-icons/sl";
import { RiSettingsLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Navbar = ({ navState }) => {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path;
  };
  const { user } = useAuth();

  return (
    <nav className={navState ? "visible" : "hidden"}>
      <ul>
        <li className={isActive("/") ? "active" : ""}>
          <Link to="/">
            <GoHome className="icon" /> HOME
          </Link>
        </li>
        <li className={isActive("/explore") ? "active" : ""}>
          <Link to="/explore">
            <ImCompass2 className="icon" /> EXPLORE
          </Link>
        </li>
        <li className={isActive("/folders") ? "active" : ""}>
          <Link to="/folders">
            <LuFolder className="icon" /> FOLDERS
          </Link>
        </li>
        <li className={isActive("/search") ? "active" : ""}>
          <Link to="/search">
            <GoSearch className="icon" /> SEARCH
          </Link>
        </li>
        <li className={isActive("/notes") ? "active" : ""}>
          <Link to="/notes">
            <TbNotebook className="icon" /> NOTES
          </Link>
        </li>
        <li className={isActive("/profile") ? "user active" : "user"}>
          <Link to="/profile">
          { !user?.avatarUrl ? <img src="https://plus.unsplash.com/premium_photo-1675626487177-c3d2f8d9ccf7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="icon" alt="user nav icon" width="50" height="50"/> :  <SlUser className="icon" />} PROFILE 
          </Link>
        </li>
        <li className={isActive("/settings") ? "active" : ""}>
          <Link to="/settings">
            <RiSettingsLine className="icon" /> SETTINGS
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
