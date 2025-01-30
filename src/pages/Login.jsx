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
    <div
      row={true}
      className="flex-align-center"
      style={{ display: "flex", height: "100vh", overflowY: "hidden" }}
    >
      {/* Left Side - Container */}
      <div className="left-side">
        <div style={{ flex: 1, margin: "20px auto 0", opacity: 1 }}>
          <img
            src="logo.png"
            alt="RADFish Cruise App logo"
            style={{ width: "120px" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            flex: 2,
          }}
        >
          <div className="form-wrapper">
            {user && (
              <div
                onClick={handleNavigateSwitchAccounts}
                className="login__go-back-button"
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
      </div>

      {/* Right Side - Image */}
      <div style={{ flex: 1, height: "100%" }} className="desktop-only">
        <img
          src="cruise-station.webp"
          alt="Cruise Station"
          className="login-image"
        />
      </div>
    </div>
  );
};

export default Login;
