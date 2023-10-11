import { useEffect, useState } from "react";

const backendurl = "http://localhost:3001/"
const userInfo = {};

export default function Favorites() {
    const [userName, setUserName] = useState();
    const [searchChannel, setSearchChannel] = useState<string>("");

    useEffect(()=>{
        const FetchUserFavorites = async ()=>{
            const response = await fetch(backendurl+"user/channel/favorite", {
                method: "GET",
                body: JSON.stringify(userInfo),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    },[])

    function UpdateSearchChannel() {

    }

    function AddFavorite() {

    }

    return (
        <>
            <main className="w-screen h-screen flex items-center justify-center">
                <div className="w-5/6 h-4/5 flex flex-col justify-start items-start text-center gap-2">
                    <div className="text-2xl">My favorites</div>
                    <div className="w-full h-1/2 bg-red-50 flex flex-col rounded-md border-gray-400 border-2">

                    </div>
                    <div className="text-2xl">Add new favorites</div>
                    <input
                        type="text"
                        className="block p-2 pl-10 w-70 text-gray-900 rounded-md border-gray-400 border-2 focus:pl-3"
                        onChange={UpdateSearchChannel} 
                        value={searchChannel}
                        placeholder="Search channels"
                    />
                    <div className="w-full h-1/2 bg-red-50 flex flex-col rounded-md border-gray-400 border-2">

                    </div>
                </div>
            </main>
        </>
    );
}