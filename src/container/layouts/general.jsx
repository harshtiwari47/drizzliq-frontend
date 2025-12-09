import React from "react";
import Navbar from "../nav/nav";
import Header from "../header/header";
import "./style.css";

const PageLayout = ({children}) => {
    const [navState, setNavState] = React.useState(false);

    return (
        <div id="pageLayout1">
            <Header navState={navState} setNavState={setNavState}></Header>
            <div id="main">
                <Navbar navState={navState} className="sidebar"/>
                <div className="page">{children}</div>
            </div>
        </div>
    );
}

export default PageLayout;