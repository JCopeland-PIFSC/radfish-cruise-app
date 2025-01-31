import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import {
  Button,
  Icon,
  GridContainer,
  Grid,
  Modal,
  ModalHeading,
  ModalFooter,
  ModalToggleButton,
  ButtonGroup,
  Form,
  Label,
  TextInput,
} from "@trussworks/react-uswds";
import { useAuth } from "../context/AuthContext";
import { AppCard,Spinner } from "../components";
import { post } from "../utils/requestMethods";

const SwitchAccounts = () => {
  const {
    user: currentUser,
    allUsers,
    setCurrentUser,
    signOut,
    userLoading,
    login,
  } = useAuth();

  const navigate = useNavigate();
  const { isOffline } = useOfflineStatus();
  const [pendingSignOutUserId, setPendingSignOutUserId] = useState(null);
  const modalRef = useRef(null);

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const additionalWarning =
    "No Authorized users stored. Please connect to the network. At least one authorized user required to use offline.";

  useEffect(() => {
    if (userLoading) return;

    if (allUsers?.length) return;

    if (isOffline) {
      navigate("/app-status", {
        state: {
          additionalWarning,
        },
      });
      return;
    }

    navigate("/login");
  }, [allUsers, isOffline, userLoading, navigate]);

  const handleSelectedUserClick = (user) => {
    setCurrentUser(user);
    navigate("/cruises");
  };

  const handleUserSignOut = (userId) => {
    if (isOffline) {
      setPendingSignOutUserId(userId);
      modalRef.current?.toggleModal?.();
    } else {
      signOut(userId);
    }
  };

  const confirmSignOut = () => {
    if (pendingSignOutUserId) {
      signOut(pendingSignOutUserId);
      setPendingSignOutUserId(null);
    }
    // Close the modal after confirming
    modalRef.current?.toggleModal?.();
  };

  const handleInlineLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const endpoint = "/api/login";
      const payload = Object.fromEntries(formData.entries());
      const data = await post(endpoint, payload);

      if (data) {
        await login(data.user);
        event.target.reset();
        setError("");
        navigate("/app-status");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <GridContainer className="usa-section text-color-black">
        <Grid row={true} className="flex-justify-center">
          <Grid col={12} tablet={{ col: 8 }} desktop={{ col: 6 }}>
            <AppCard>
              <h1 className="margin-bottom-1 text-center">Switch Accounts</h1>
              {/* Render fetched users dynamically */}
              {isOffline && !allUsers?.length && (
                <p>
                  Warning: The app cannot be used offline without an
                  authenticated user.
                </p>
              )}

              {allUsers.length > 0 ? (
                <div>
                  {allUsers.map((user) => (
                    <div key={user.id} className="switch-accounts__button">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectedUserClick(user)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleSelectedUserClick(user);
                          }
                        }}
                        className="switch-accounts__username"
                      >
                        {currentUser?.id === user.id && (
                          <Icon.CheckCircle
                            size={3}
                            aria-label="Selected user"
                            style={{ position: "absolute", left: "4rem" }}
                          />
                        )}
                        <span>{user.username}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserSignOut(user.id);
                        }}
                        className="switch-accounts__close-button"
                        aria-label={`Sign out ${user.username}`}
                      >
                        <Icon.Close size={3} aria-label="close" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <Spinner />
              )}

              {/* Inline Login Form: only show if online (since we can't add new user offline) */}
              {!isOffline && (
                <div className="border-top border-base-lighter margin-top-6 padding-top-1">
                  <h2 className="text-center">Sign in to store a new account</h2>
                  <Form onSubmit={handleInlineLogin}>
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
                      className="usa-show-password text-color-black"
                      aria-controls="password"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide password" : "Show password"}
                    </button>

                    <Button
                      type="submit"
                      className="margin-top-2"
                    >
                      Sign In
                    </Button>
                  </Form>
                  {error && <p className="text-error">{error}</p>}
                </div>
              )}
            </AppCard>
          </Grid>
        </Grid>
      </GridContainer>

      {/* OFFLINE SIGN-OUT WARNING MODAL */}
      <Modal
        ref={modalRef}
        id="offline-signout-modal"
        aria-labelledby="offline-signout-modal-heading"
        aria-describedby="offline-signout-modal-description"
      >
        <ModalHeading id="offline-signout-modal-heading">
          You are offline!
        </ModalHeading>
        <div className="usa-prose">
          <p id="offline-signout-modal-description">
            You will not be able to log back in while offline. Are you sure you
            want to sign out?
          </p>
        </div>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={confirmSignOut}>Sign Out Anyway</Button>
            <ModalToggleButton modalRef={modalRef} closer unstyled>
              Cancel
            </ModalToggleButton>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default SwitchAccounts;
