import React from "react";
import PageLayout from "../../container/layouts/general";
import { useAuth } from "../../context/authContext";
import "./styles/profile.css";
import { IoLogoGithub } from "react-icons/io5";
import { IoIosGlobe } from "react-icons/io";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaTwitter } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";

const Profile = () => {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="pageTitle">
        <strong>@ {user.username}</strong>
      </div>

      <div className="ptopSection">
        <div className="profileBanner">
          <img src="https://picsum.photos/1280/400" alt="user banner" />
        </div>
        <div className="profileAvatar">
          <img src="https://picsum.photos/400" alt="user avatar" />
          <h2 className="user-name">HARSH TIWARI</h2>
        </div>
      </div>
      <div>
        <p className="user-bio">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid rerum voluptatibus, optio ex sit, praesentium quisquam sequi inventore nihil architecto, cupiditate odit asperiores officia labore! Reprehenderit animi quos amet ullam!</p>
        <ul className="socialLinks">
            <li><a href="/"><IoIosGlobe /></a></li>
            <li><a href="/"><IoLogoGithub /></a></li>
            <li><a href="/"><IoLogoLinkedin /></a></li>
            <li><a href="/"><FaTwitter /></a></li>
            <li><a href="/"><FiInstagram /></a></li>
        </ul>
      </div>
    </PageLayout>
  );
};

export default Profile;
