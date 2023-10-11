import { API_URL } from "@/globals";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { VideoType } from "@/types";

const Post = () => {
  const router = useRouter();
  const { channel_id } = router.query;
  const [videos, setVideos] = useState<VideoType[]>([]);
  console.log("chid", channel_id);

  useEffect(() => {
    if (channel_id === undefined) {
      return;
    }
    const url = new URL(`${API_URL}/trending/video/inputs`);
    url.searchParams.set("channel_id", channel_id as string);
    url.searchParams.set("limit", "15");

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.result);
        setVideos(res.result);
      });
  }, [channel_id]);

  return (
    <div>
      {videos.length > 0 ? (
        <>
          <h1 className="p-5 text-2xl ">
            {videos[0].channelTitle} Most Trending Videos
          </h1>
          <div className="flex flex-wrap">
            {videos.map((video: any) => (
              <div
                key={video.id}
                className="bg-gray-100 rounded-md p-5 m-5 w-96 flex-col"
              >
                <div>{video.title}</div>
                <span className="flex flex-row gap-5">
                  <div>{video.views} views</div>
                  <div>{video.likes} likes</div>
                  <div>{video.dislikes} dislikes</div>
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>No videos found</div>
      )}
    </div>
  );
};

export default Post;
