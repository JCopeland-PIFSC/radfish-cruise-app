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
  Link,
  GridContainer,
  Grid,
} from "@trussworks/react-uswds";

const Login = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  if (user?.isAuthenticated) {
    navigate("/cruises"); // Adjust the path as needed
    return null; // Prevent rendering the login form
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = { id: null, username: null };
    try {
      const endpoint = "/api/login"; // Replace with your actual login endpoint
      const payload = Object.fromEntries(formData.entries());
      const data = await post(endpoint, payload);

      for (const [key, value] of formData.entries()) {
        values[key] = value;
      }

      if (data) {
        console.log("data", data);
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
                    <Label htmlFor="email">Email address</Label>
                    <TextInput
                      id="username"
                      name="username"
                      type="text"
                      autoCorrect="off"
                      autoCapitalize="off"
                      required
                      //   value={username}
                      //   onChange={(e) => setUsername(e.target.value)}
                    />

                    <Label htmlFor="password-sign-in">Password</Label>
                    <TextInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoCorrect="off"
                      autoCapitalize="off"
                      required
                      //   value={password}
                      //   onChange={(e) => setPassword(e.target.value)}
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

                    {/* TODO: Add forgot password link */}
                    {/* <p>
                      <Link href="javascript:void();">Forgot password?</Link>
                    </p> */}
                  </Fieldset>
                </Form>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>

              {/* TODO: Add create account link */}
              {/* <p className="text-center">
                {"Don't have an account? "}
                <Link href="javascript:void();">Create your account now</Link>.
              </p> */}

              {/* TODO: Add SSO login */}
              {/* <div className="border-top border-base-lighter margin-top-3 padding-top-1">
                <h2>Are you a federal employee?</h2>
                <div className="usa-prose">
                  <p>
                    If you are a federal employee or [other secondary user],
                    please use [secondary Single Sign On (SSO)].
                  </p>
                  <p>
                    <Button type="button" outline={true}>
                      Launch secondary SSO
                    </Button>
                  </p>
                </div>
              </div> */}
            </Grid>
          </Grid>
        </GridContainer>
      </div>
    </main>
  );
};

export default Login;
