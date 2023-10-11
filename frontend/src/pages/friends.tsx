import { API_URL } from "@/globals";
import { useState, useEffect } from "react";
import { UserInfo } from "@/types";

export default function Register() {
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await fetch(`${API_URL}/allUsers`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);

      if (response.ok) {
        const users = (
          (await response.json()) as {
            result: UserInfo[];
          }
        ).result;

        setAllUsers(users);
      }
    };
    getAllUsers();
  }, []);

  const renderAllUsers = () => {
    return allUsers.map((r) => {
      return (
        <div
          className="bg-gray-100 rounded-md hover:bg-gray-200 duration-200 p-3"
          key={r.username}
        >
          <p>Username: {r.username}</p>
          <p>Name: {r.firstName || ""} {r.lastName || ""}</p>
          <p>Email: {r.email || ""}</p>
        </div>
      );
    });
  };

  return (
    <>
      <main className="flex w-screen flex-col justify-center items-center text-center gap-2">
        <p>See other users on our platform below</p>
        <div className="flex flex-col">{renderAllUsers()}</div>
      </main>
    </>
  );
}
