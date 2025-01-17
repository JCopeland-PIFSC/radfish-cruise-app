import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { Button, GridContainer, Grid } from "@trussworks/react-uswds";
import { useGetAuthenticatedUsers } from "../hooks/useUsers";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components";

const SwitchAccounts = () => {
  const [users, setUsers] = useState([]);
  const { getAllAuthenticatedUsers } = useGetAuthenticatedUsers();
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const { isOffline } = useOfflineStatus();

  // Fetch authenticated users on component mount
  useEffect(() => {
    const fetchUsersFromIndexedDB = async () => {
      try {
        const fetchedUsers = await getAllAuthenticatedUsers();
        setUsers(fetchedUsers);
        if (!isOffline && !fetchedUsers?.length) {
          navigate("/login");
        }
        if (isOffline && !fetchedUsers?.length) {
          navigate("/app-init-status", {
            state: {
              additionalWarning: "No Authorized users stored. Please connect to the network. At least one authorized user required to use offline."
            }
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsersFromIndexedDB();
  }, [getAllAuthenticatedUsers]);

  const handleSelectedUserClick = async (user) => {
    await setCurrentUser(user.id);
    navigate("/cruises");
  };

  const handleAddAccountClick = () => {
    setCurrentUser(null);
    navigate("/login");
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
                {isOffline && !users?.length && (
                  <p>Warning: The app cannot be used offline without an authenticated user.</p>
                )}
                {users.length > 0 ? (
                  <div>
                    {users.map((user, index) => (
                      <p key={index}>
                        <Button
                          type="button"
                          outline={true}
                          className="width-full text_transform-capitalize"
                          onClick={() => handleSelectedUserClick(user)}
                        >
                          {user.username}
                        </Button>
                      </p>
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
                      <Button type="button" className="width-full" onClick={handleAddAccountClick}>
                        Add Account
                      </Button>
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
