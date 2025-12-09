import "../styles/login.css";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  return (
    <div className="authPage">
      <div className="leftCard">
        <img
          src="https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg"
          width="100%"
          alt="Login"
        />
      </div>
      <div className="rightCard">
        <form>
          <div className="pageTitle">
            <strong>Forget Password? ❯</strong>
          </div>
          <div className="msgBar">
            <p>Enter email associated with your account</p>
          </div>
          <input type="email" name="email" placeholder="Enter your email" />
          <input disabled type="submit" value="Send Confirmation Email" />
          <div className="registerBtnBar">
            <p>Don't have an account?</p>
            <Link to="/signup">REGISTER</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
