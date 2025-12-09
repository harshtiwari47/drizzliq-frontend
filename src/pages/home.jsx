import React from "react";
import PageLayout from "../container/layouts/general";
import "./styles/home.css";
import { useAuth } from "../context/authContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="greetCard">
        <h1>Welcome @{user?.username}</h1>
        <p>Email: {user?.email}</p>
      </div>
    </PageLayout>
  );
};

export default Home;