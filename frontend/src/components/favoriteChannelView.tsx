import { API_URL } from "@/globals";
import { ChannelType } from "@/types";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const ChannelView = () => {
  const [favChannels, setFavChannels] = useState([] as ChannelType[]);

  useEffect(() => {
    getFavoriteChannels();
  }, []);

  const getFavoriteChannels = async () => {
    const url = new URL(`${API_URL}/user/channel/favorite`);
    const response = await fetch(url, { credentials: "include" });
    if (response.ok) {
      const channelsResponse = (await response.json()) as {
        result: ChannelType[];
      };

      setFavChannels(channelsResponse.result);
      console.log("channels", channelsResponse.result);
    }
  };

  const deleteFromFavorites = async (id: string) => {
    const url = new URL(`${API_URL}/user/channel/unfavorite`);
    url.searchParams.set("channelId", id);
    const response = await fetch(url, {
      credentials: "include",
      method: "DELETE",
    });
    if (!response.ok) {
      console.log(response.statusText);
    }

    getFavoriteChannels();
  };

  return (
    <div className="flex justify-center flex-col m-8 p-5">
      <span className="flex flex-row items-center">
        <div className="text-2xl my-3">Favorite Channels</div>
        <button
          className="p-1 px-2.5 h-fit bg-blue-600 text-white mx-2 rounded-md"
          onClick={getFavoriteChannels}
        >
          Refresh
        </button>
      </span>
      <div className="my-2">
        {favChannels.length > 0 ? (
          favChannels.map((c) => {
            return (
              <div
                className="flex flex-row w-1/3 justify-between bg-gray-100 rounded-md hover:bg-gray-200 duration-200 my-3 p-3"
                key={c.id}
              >
                <a href={`/trending/${c.id}`}>{c.channelTitle}</a>
                <div className="text-gray-100 text-xs">{c.id}</div>
                <button onClick={() => deleteFromFavorites(c.id)}>
                  <Icon
                    icon="ph:trash-bold"
                    className="text-red-700 text-3xl"
                  />
                </button>
              </div>
            );
          })
        ) : (
          <div>No favorited channels to show, Click refresh to refresh</div>
        )}
      </div>
    </div>
  );
};

export default ChannelView;
