import { API_URL } from "@/globals";
import { useState, useEffect } from "react";

export default function Register() {
  const [regUsername, setRegUsername] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const registerUser = async () => {
    const registerBody = {
      username: regUsername,
      firstName: regFirstName,
      lastName: regLastName,
      password: regPassword,
      email: regEmail,
    };

    const response = await fetch(`${API_URL}/user`, {
      method: "POST",
      body: JSON.stringify(registerBody),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(API_URL);

    setRegUsername("");
    setRegFirstName("");
    setRegLastName("");
    setRegPassword("");
    setRegEmail("");

    if (response.ok) {
      window.alert("Successfully registered!");
    } else {
      window.alert("Error registering, please try again.")
    }
  };

  const loginUser = async () => {
    const registerBody = {
      username: loginUsername,
      password: loginPassword,
    };
    console.log(registerBody);

    const url = new URL(`${API_URL}/user`);
    url.searchParams.set("username", loginUsername);
    url.searchParams.set("password", loginPassword);

    const response = await fetch(url, {
      credentials: "include",
    });
    console.log(response);

    setLoginPassword("");
    setLoginUsername("");

    if (response.ok) {
      window.alert("Logged in");
      window.location = "/" as string & Location;
    } else {
      window.alert("Error logging in, please try again");
    }
  };

  return (
    <>
      <main className="flex w-screen flex-row justify-center items-start text-center gap-10">
        <div className="flex flex-col">
          <div className="text-2xl m-3">Login</div>
          <div className="text-left mx-2">Username</div>
          <input
            onChange={(e) => {
              setLoginUsername(e.target.value);
            }}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Password</div>
          <input
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <button
            className="bg-blue-600 rounded-md p-2 m-3 w-20 text-white"
            onClick={loginUser}
          >
            Log In
          </button>
        </div>
        <div className="flex flex-col">
          <div className="text-2xl m-3">Register</div>
          <div className="text-left mx-2">Username</div>
          <input
            onChange={(e) => {
              setRegUsername(e.target.value);
            }}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="flex flex-row">
            <div className="flex-flex-col">
              <div className="text-left mx-2">First Name</div>
              <input
                onChange={(e) => {
                  setRegFirstName(e.target.value);
                }}
                type="text"
                className="border-gray-400 border-2 p-1 m-2 rounded-md"
              />
            </div>
            <div className="flex-flex-col">
              <div className="text-left mx-2">Last Name</div>
              <input
                onChange={(e) => {
                  setRegLastName(e.target.value);
                }}
                type="text"
                className="border-gray-400 border-2 p-1 m-2 rounded-md"
              />
            </div>
          </div>
          <div className="text-left mx-2">Email</div>
          <input
            onChange={(e) => {
              setRegEmail(e.target.value);
            }}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Password</div>
          <input
            onChange={(e) => {
              setRegPassword(e.target.value);
            }}
            type="password"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <button
            className="bg-blue-600 rounded-md p-2 m-3 w-20 text-white"
            onClick={registerUser}
          >
            Register
          </button>
        </div>
      </main>
    </>
  );
}
