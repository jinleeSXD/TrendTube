import { API_URL } from "@/globals";
import { useState, useEffect } from "react";
import { UserInfo } from "@/types";

const UserInfoUpdate = () => {
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await fetch(`${API_URL}/user/info`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsLoggedIn(response.ok);

      if (response.ok) {
        const { firstName, lastName, email } = (
          (await response.json()) as {
            result: UserInfo[];
          }
        ).result[0];

        setNewFirstName(firstName || "");
        setNewLastName(lastName || "");
        setNewEmail(email || "");
      }
    };
    getUserInfo();
  }, []);

  const updateUser = async () => {
    const updateBody = {
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
    };

    const response = await fetch(`${API_URL}/user/info`, {
      method: "PUT",
      body: JSON.stringify(updateBody),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      window.alert("User information successfully updated!");
    }
  };

  return (
    <>
      <main className="flex w-screen flex-row justify-center items-start text-center gap-10">
        <div className="flex flex-col">
          <div className="text-2xl m-3">Update User Information</div>
          {isLoggedIn ? (
            <>
              <div className="flex flex-row">
                <div className="flex-flex-col">
                  <div className="text-left mx-2">First Name</div>
                  <input
                    value={newFirstName}
                    onChange={(e) => {
                      setNewFirstName(e.target.value);
                    }}
                    type="text"
                    className="border-gray-400 border-2 p-1 m-2 rounded-md"
                  />
                </div>
                <div className="flex-flex-col">
                  <div className="text-left mx-2">Last Name</div>
                  <input
                    value={newLastName}
                    onChange={(e) => {
                      setNewLastName(e.target.value);
                    }}
                    type="text"
                    className="border-gray-400 border-2 p-1 m-2 rounded-md"
                  />
                </div>
              </div>
              <div className="text-left mx-2">Email</div>
              <input
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                }}
                type="text"
                className="border-gray-400 border-2 p-1 m-2 rounded-md"
              />
              <button
                className="bg-blue-600 rounded-md p-2 m-3 w-20 text-white"
                onClick={updateUser}
              >
                Update
              </button>
            </>
          ) : (
            <p>No user is logged in</p>
          )}
        </div>
      </main>
    </>
  );
};

export default UserInfoUpdate;
