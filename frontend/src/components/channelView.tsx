import { API_URL } from "@/globals";
import { ChannelType } from "@/types";
import { useState } from "react";
import { Icon } from "@iconify/react";

const ChannelView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [channels, setChannels] = useState([] as ChannelType[]);

  const searchChannels = async () => {
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
  };

  const favoriteChannel = async (id: string) => {
    const response = await fetch(`${API_URL}/user/channel/favorite`, {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  };

  return (
    <div className="flex justify-center flex-col m-8 p-5">
      <div className="text-2xl my-3">Channels</div>
      <span>
        <input
          type="text"
          placeholder="Search for Channels"
          className="border-2 border-black rounded-md w-96 p-1"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="p-1.5 px-2.5 bg-blue-600 text-white mx-2 rounded-md"
          onClick={searchChannels}
        >
          Search
        </button>
      </span>
      <div className="my-2">
        {channels.map((c) => {
          return (
            <div
              className="flex flex-row w-1/3 justify-between bg-gray-100 rounded-md hover:bg-gray-200 duration-200 my-3 p-3"
              key={c.id}
            >
              <a href={`/trending/${c.id}`}>{c.channelTitle}</a>
              <button onClick={() => favoriteChannel(c.id)}>
                <Icon
                  icon="mdi:cards-heart"
                  className="text-red text-2xl"
                  color="red"
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelView;
