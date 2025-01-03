import React, { useState, useEffect } from "react";
import { post } from "../utils/requestMethods";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Form,
  Fieldset,
  Label,
  TextInput,
  Button,
  GridContainer,
  Grid,
  Select,
} from "@trussworks/react-uswds";

const Login = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const addAccountMode = searchParams.get("addAccount");

  useEffect(() => {
    if (user?.isAuthenticated && !addAccountMode) {
      navigate("/cruises");
    }
  }, [user, navigate, addAccountMode]);

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
        navigate("/cruises");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <main id="main-content">
      <div className="bg-base-lightest">
        <GridContainer className="usa-section">
          <Grid row={true} className="flex-justify-center">
            <Grid
              col={12}
              tablet={{
                col: 8,
              }}
              desktop={{
                col: 6,
              }}
            >
              <div className="bg-white padding-y-3 padding-x-5 border border-base-lighter">
                <h1 className="margin-bottom-0">Sign in</h1>
                <Form onSubmit={handleLogin}>
                  <Fieldset legend="Access your account" legendStyle="large">
                    <Label htmlFor="username">Username</Label>
                    <TextInput
                      id="username"
                      name="username"
                      type="username"
                      autoCorrect="off"
                      autoCapitalize="off"
                      required
                    />

                    <Label htmlFor="password-sign-in">Password</Label>
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
                      aria-controls="password-sign-in"
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? "Hide password" : "Show password"}
                    </button>
                    <Button type="submit">Sign in</Button>
                  </Fieldset>
                </Form>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            </Grid>
          </Grid>
        </GridContainer>
      </div>
    </main>
  );
};

export default Login;
