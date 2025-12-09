import "../styles/login.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  // redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  // form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [acceptedTC, setAcceptedTC] = useState(false);

  // ui state
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  // fieldErrors will contain only a single field at a time: { username?: string, email?: string, password?: string }
  const [fieldErrors, setFieldErrors] = useState({});

  function validateClient() {
    const errors = {};
    if (!username || username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters.";
    } else if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      errors.username =
        "Username can contain letters, numbers, dots and underscores only.";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address.";
    }

    // require minimum 8 characters to match UI messaging
    if (!pw || pw.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    } else {
      // encourage strong password but leave authoritative validation to server
      if (!/[A-Z]/.test(pw))
        errors.password = "Include at least one uppercase letter.";
      else if (!/[a-z]/.test(pw))
        errors.password = "Include at least one lowercase letter.";
      else if (!/[0-9]/.test(pw))
        errors.password = "Include at least one digit.";
      else if (!/[^A-Za-z0-9]/.test(pw))
        errors.password = "Include at least one special character.";
    }
    
    if (!acceptedTC) {
      errors.terms = "You must accept the Terms & Conditions.";
      setGlobalError("You must accept the Terms & Conditions.");
    }

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGlobalError(null);
    setFieldErrors({});
    setLoading(true);

    // client validation
    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length) {
      // show only the first error at a time
      const firstKey = Object.keys(clientErrors)[0];
      setFieldErrors({ [firstKey]: clientErrors[firstKey] });
      setLoading(false);
      return;
    }

    try {
      const result = await signup(
        { username, email, password: pw },
        { autoLogin: true }
      );

      let success = false;

      if (result && typeof result === "object") {
        success = !!result?.id;
      }

      if (success) {
        // successful signup (or auto-login)
        navigate("/", { replace: true });
        return;
      }
    } catch (err) {
      try {
        setGlobalError(err.message);
      } catch (inner) {
        setGlobalError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  }

  // helpers to clear a single field error when user edits that field
  const clearFieldError = (field) => {
    if (!fieldErrors[field]) return;
    const copy = { ...fieldErrors };
    delete copy[field];
    setFieldErrors(copy);
  };

  return (
    <div className="authPage">
      <div className="leftCard">
        <img
          src="https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg"
          width="100%"
          alt="illustration"
        />
      </div>

      <div className="rightCard">
        <form onSubmit={handleSubmit} noValidate>
          <div className="pageTitle">
            <strong>SIGN-UP NOW ❯</strong>
          </div>

          <div className="msgBar">
            <p>Welcome! Explore freely — love to see you here!</p>
          </div>

          {/* Username */}
          <label htmlFor="signup-username" className="sr-only">
            Username
          </label>
          <input
            id="signup-username"
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearFieldError("username");
            }}
            placeholder="Enter your username"
            aria-invalid={!!fieldErrors.username}
            aria-describedby={fieldErrors.username ? "err-username" : undefined}
            autoComplete="username"
            className={fieldErrors.username ? "inputError" : undefined}
          />
          {fieldErrors.username && (
            <div id="err-username" className="errorMSG" role="alert">
              {fieldErrors.username}
            </div>
          )}

          {/* Email */}
          <label htmlFor="signup-email" className="sr-only">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            placeholder="Enter your email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "err-email" : undefined}
            autoComplete="email"
            className={fieldErrors.email ? "inputError" : undefined}
          />
          {fieldErrors.email && (
            <div id="err-email" className="errorMSG" role="alert">
              {fieldErrors.email}
            </div>
          )}

          {/* Password */}
          <label htmlFor="signup-password" className="sr-only">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            name="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              clearFieldError("password");
            }}
            placeholder="Enter your password"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? "err-password" : undefined}
            autoComplete="new-password"
            className={fieldErrors.password ? "inputError" : undefined}
          />
          <p className="passInfo">
            Password must be at least 8 characters long, include uppercase,
            lowercase, a number and a special character.
          </p>
          {fieldErrors.password && (
            <div id="err-password" className="errorMSG" role="alert">
              {fieldErrors.password}
            </div>
          )}

          {/* Global error */}
          {globalError && (
            <div className="errorMSG" role="alert">
              {globalError}
            </div>
          )}

          <input
            aria-label="Sign up"
            type="submit"
            value={loading ? "Signing..." : "Sign up"}
            disabled={loading}
          />

          <div className="registerBtnBar">
            <div className="tC">
              <input
                type="checkbox"
                id="tc"
                checked={acceptedTC}
                onChange={(e) => setAcceptedTC(e.target.checked)}
                className={fieldErrors.tc ? "inputError" : undefined}
              />
              <label htmlFor="tc">
                <Link to="#"> Accept Terms &amp; Conditions</Link>
              </label>
            </div>
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
