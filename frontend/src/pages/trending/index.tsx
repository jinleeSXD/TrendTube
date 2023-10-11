import { useEffect, useState } from "react";
import { ChannelType, VideoType} from "../../types"
import { API_URL } from "../../globals";

export default function TrendingVideos() {
    const [searchTerm, setSearchTerm] = useState("");
    const [videos, setVideos] = useState([] as VideoType[]);
    const [channels, setChannels] = useState([] as ChannelType[])

    useEffect(()=>{
        const url = new URL(`${API_URL}/trending/video`);
        url.searchParams.set("limit", "15");
        fetch(url, { credentials: "include" })
        .then((res) => res.json())
        .then((res) => {
            console.log(res.result);
            setVideos(res.result);
        });
    },[])

    const searchChannel = async ()=>{
        if (searchTerm.length == 0) return;
        const url = new URL(`${API_URL}/channel/search`);
        url.searchParams.set("keyword", searchTerm);
        url.searchParams.set("limit", "100");
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) {
        console.log(response.statusText);
        }

        const channelsResponse = (await response.json()) as {
        result: ChannelType[];
        };
        setChannels(channelsResponse.result);
        console.log("channels", channels);
    }

    return (
        <div>
            <div className="h-screen flex justify-center flex-col m-8 p-5">
                <div className='h-2/4 overflow-auto'>
                    <div className='sticky top-0 bg-white text-2xl'>Trending Videos from All Channels</div>
                    <div className="my-2">
                    {videos.map((v) => {
                    return (
                        <div
                        className="flex flex-row w-1/3 justify-between bg-gray-100 rounded-md hover:bg-gray-200 duration-200 my-3 p-3"
                        key={v.id}>
                        {v.title}
                        </div>
                    );
                    })}
                    </div>
                </div>

                <div  className="h-2/4 overflow-auto">
                    <input
                    type="text"
                    placeholder="Search for Channels"
                    className="sticky top-0 border-2 border-black rounded-md w-96 p-1"
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    />
                    <button
                    className="p-1.5 px-2.5 bg-blue-600 text-white mx-2 rounded-md"
                    onClick={searchChannel}
                    >Search</button>

                    <div className="my-2">
                    {channels.map((c) => {
                    return (
                        <div
                        className="flex flex-row w-1/3 justify-between bg-gray-100 rounded-md hover:bg-gray-200 duration-200 my-3 p-3"
                        key={c.id}>
                        <a href={`/trending/${c.id}`}>{c.channelTitle}</a>
                        </div>
                    );
                    })}
                    </div>
                </div>
        </div>
    </div>
    );
};