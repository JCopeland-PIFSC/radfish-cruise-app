import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { Button, Icon, GridContainer, Grid } from "@trussworks/react-uswds";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components";

const SwitchAccounts = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { isOffline } = useOfflineStatus();

  // Fetch authenticated users on component mount
  useEffect(() => {
    const handleOfflineNavigation = async () => {
      try {
        if (!allUsers?.length) {
          if (isOffline) {
            navigate("/app-init-status", {
              state: {
                additionalWarning:
                  "No Authorized users stored. Please connect to the network. At least one authorized user required to use offline.",
              },
            });
          } else {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error handling offline navigation:", error);
      }
    };
  
    if (!allUsers?.length) {
      handleOfflineNavigation();
    }
  }, [allUsers?.length, isOffline, navigate]);
  

  const handleSelectedUserClick = (user) => {
    switchUser(user);
    navigate("/cruises");
  };

  const handleUserSignOut = (userId) => {
    signOut(userId);
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
                <h1 className="margin-bottom-1 text_align-center">
                  Switch Accounts
                </h1>
                {/* Render fetched users dynamically */}
                {isOffline && !allUsers?.length && (
                  <p>
                    Warning: The app cannot be used offline without an
                    authenticated user.
                  </p>
                )}
                {allUsers.length > 0 ? (
                  <div>
                    {allUsers.map((user, index) => (
                      <div
                        key={index}
                        className="usa-button width-full text_transform-capitalize position-relative"
                        onClick={() => handleSelectedUserClick(user)}
                        style={{
                          padding: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          border: "2px solid #005ea2",
                          borderRadius: "4px",
                          marginBottom: "8px",
                          position: "relative",
                          color: "#005ea2",
                          backgroundColor: "#fff",
                        }}
                      >
                        {/* Check Icon for the current user */}
                        {currentUser?.id === user.id && (
                          <Icon.CheckCircle
                            size={3}
                            aria-label="Selected user"
                            style={{
                              left: "20px",
                              position: "absolute",
                            }}
                          />
                        )}

                        {/* Username */}
                        <span style={{ flex: 1 }}>{user.username}</span>

                        {/* Sign Out Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserSignOut(user.id);
                          }}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            backgroundColor: "transparent",
                            border: "none",
                            color: "dimgray",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                          }}
                          aria-label={`Sign out ${user.username}`}
                        >
                          Sign Out
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Spinner />
                )}
                {!isOffline && (
                  <div className="border-top border-base-lighter margin-top-6 padding-top-1">
                    <p className="text_align-center">
                      {"Log in to store a new account"}
                    </p>
                    <p>
                      <Link to="/login">
                        <Button type="button" className="width-full">
                          Add Account
                        </Button>
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
        </GridContainer>
      </div>
    </main>
  );
};

export default SwitchAccounts;
