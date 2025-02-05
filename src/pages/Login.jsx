import React, { useState } from "react";
import { post } from "../utils/requestMethods";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Form,
  Fieldset,
  Label,
  TextInput,
  Button,
  Icon,
} from "@trussworks/react-uswds";

const Login = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const endpoint = "/api/login";
      const payload = Object.fromEntries(formData.entries());
      const data = await post(endpoint, payload);

      if (data) {
        await login(data.user);
        event.target.reset();
        navigate("/app-status");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleNavigateSwitchAccounts = () => {
    navigate("/switch-accounts");
  };

  return (
    <div row="true" className="login__container">
      {/* Left Side - Container */}
      <div className="login__left-side">
        <img
          src="logo-white.webp"
          alt="RADFish Cruise App logo"
          className="login__logo"
        />
        <div className="login__form-wrapper">
          {user && (
            <div
              onClick={handleNavigateSwitchAccounts}
              className="go-back-button"
            >
              <Icon.ArrowBack size={2} aria-label="Back to switch accounts" />
              Go Back to Switch Accounts
            </div>
          )}
          <h1 className="margin-bottom-2">Log in</h1>
          <Form onSubmit={handleLogin}>
            <Fieldset
              legend="View and store your cruise data for offline access"
              legendStyle="medium"
            >
              <Label htmlFor="username">Username</Label>
              <TextInput
                id="username"
                name="username"
                type="text"
                autoCorrect="off"
                autoCapitalize="off"
                required
              />

              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoCorrect="off"
                autoCapitalize="off"
                required
              />

              <button
                title="Show password"
                type="button"
                className="usa-show-password"
                aria-controls="password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide password" : "Show password"}
              </button>
              <Button type="submit">Sign in</Button>
            </Fieldset>
          </Form>
          {error && <p className="text-error">{error}</p>}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="login__right-side">
        <img
          src="birdseye-ship.webp"
          alt="Cruise Station"
          className="login__image"
        />
      </div>
    </div>
  );
};

export default Login;
