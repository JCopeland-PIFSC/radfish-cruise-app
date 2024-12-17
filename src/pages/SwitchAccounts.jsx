import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, GridContainer, Grid } from "@trussworks/react-uswds";
import { useGetAuthenticatedUsers } from "../hooks/useUsers";

const SwitchAccounts = () => {
  const { getAllAuthenticatedUsers } = useGetAuthenticatedUsers();
  const [users, setUsers] = useState([]);

  // Fetch authenticated users on component mount
  useEffect(() => {
    const fetchUsersFromIndexedDB = async () => {
      try {
        const fetchedUsers = await getAllAuthenticatedUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsersFromIndexedDB();
  }, [getAllAuthenticatedUsers]);

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
                <h1 className="margin-bottom-1">Switch Accounts</h1>
                {/* Render fetched users dynamically */}
                {users.length > 0 ? (
                  <div>
                    <h2 className="margin-top-2">Authenticated Users</h2>
                    {users.map((user, index) => (
                      <p key={index}>
                        <Button
                          type="button"
                          outline={true}
                          className="width-full"
                          onClick={() =>
                            console.log(`Switched to user: ${user.username}`)
                          }
                        >
                          {user.username}
                        </Button>
                      </p>
                    ))}
                  </div>
                ) : (
                  <p>Loading users...</p>
                )}

                <div className="border-top border-base-lighter margin-top-6 padding-top-1">
                  <p>{"Log in to store a new account"}</p>
                  <p>
                    <Link to="/login?addAccount=true">
                      <Button type="button" className="width-full">
                        Add Account
                      </Button>
                    </Link>
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>
        </GridContainer>
      </div>
    </main>
  );
};

export default SwitchAccounts;
