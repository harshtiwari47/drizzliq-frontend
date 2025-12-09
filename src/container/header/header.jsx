import React from "react";
import "./style.css";
import { RiNotification3Line } from "react-icons/ri";
import { GoPlusCircle } from "react-icons/go";
import { RiCloseLargeFill } from "react-icons/ri";
import { BsList } from "react-icons/bs";
import { Link } from "react-router-dom";

const Header = ({setNavState, navState}) => {

  return (
    <header>
      <h1>Drizzliq</h1>
      <ul>
        <li>
          {" "}
          <Link to="/create">
            <GoPlusCircle className="icon" />
          </Link>
        </li>
        <li>
          {" "}
          <Link to="/notifications">
            <RiNotification3Line className="icon" />
          </Link>
        </li>
        <li onClick={() => setNavState(s => s ? false : true)}>
          { navState ? <RiCloseLargeFill className="icon sidebarMenuBtnClose" id="sidebarMenuBtn"  /> : <BsList className="icon" id="sidebarMenuBtn" />}
        </li>
      </ul>
    </header>
  );
};

export default Header;
