import { API_URL } from "@/globals";
import { useState, useEffect } from "react";

export default function AddVideo() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [description, setDescription] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const [thumbnailLink, setThumbnailLink] = useState("");
  const [channelId, setChannelId] = useState("");
  const [categoryName, setCategoryName] = useState("Music");

  const [trendId, setTrendId] = useState(0);
  const [country, setCountry] = useState('United States');
  const [trendDate, setTrendDate] = useState('United States');


  const createVideo = async () => {
    const registerBody = {
      id,
      title,
      publishedAt,
      views,
      likes,
      dislikes,
      description,
      commentCount,
      thumbnailLink,
      channelId,
      categoryName,
    };

    const response = await fetch(`${API_URL}/video`, {
      method: "POST",
      body: JSON.stringify(registerBody),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Video has been created");
    } else {
      const { message } = (await response.json()) as {
        message: string;
      };
      alert(message);
    }
  };

  const recordTrend = async () => {
    const registerBody = {
      videoId: id,
      trendId,
      country,
      trendDate
    };

    const response = await fetch(`${API_URL}/trending/video`, {
      method: "POST",
      body: JSON.stringify(registerBody),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Trend has been recorded");
    } else {
      const { message } = (await response.json()) as {
        message: string;
      };
      alert(message);
    }
  };

  return (
    <>
      <main className="flex w-screen flex-row justify-center items-start text-center gap-10">
        <div className="flex flex-col">
          <div className="text-2xl m-3">Add Video</div>
          <div className="text-left mx-2">Video Id</div>
          <input
            onChange={(e) => {
              setId(e.target.value);
            }}
            value={id}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Channel Id</div>
          <input
            onChange={(e) => {
              setChannelId(e.target.value);
            }}
            value={channelId}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Title</div>
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Published At</div>
          <input
            onChange={(e) => {
              setPublishedAt(e.target.value);
            }}
            value={publishedAt}
            type="date"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Views</div>
          <input
            onChange={(e) => {
              setViews(parseInt(e.target.value));
            }}
            value={views}
            type="number"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Likes</div>
          <input
            onChange={(e) => {
              setLikes(parseInt(e.target.value));
            }}
            value={likes}
            type="number"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Dislikes</div>
          <input
            onChange={(e) => {
              setDislikes(parseInt(e.target.value));
            }}
            value={dislikes}
            type="number"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Description</div>
          <input
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Comment Count</div>
          <input
            onChange={(e) => {
              setCommentCount(parseInt(e.target.value));
            }}
            value={commentCount}
            type="number"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Thumbnail Link</div>
          <input
            onChange={(e) => {
              setThumbnailLink(e.target.value);
            }}
            value={thumbnailLink}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Category Name</div>
          <select id="lang" onChange={(e) => {
              setCategoryName(e.target.value);
            }} value={categoryName}>
                  <option value="Film & Animation">Film & Animation </option>
                  <option value="Autos & Vehicles">Autos & Vehicles</option>
                  <option value="Music">Music</option>
                  <option value="Pets & Animals ">Pets & Animals</option>
                  <option value="Sports">Sports</option>
                  <option value="Short Movies">Short Movies</option>
                  <option value="Travel & Events">Travel & Events</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Videoblogging">Videoblogging</option>
                  <option value="People & Blogs">People & Blogs</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value=" News & Politics">News & Politics</option>
                  <option value="Howto & Style">Howto & Style</option>
                  <option value="Science & Technology">Science & Technology</option>
                  <option value="Nonprofits & Activism">Nonprofits & Activism</option>
                  <option value="Movies">Movies</option>
                  <option value="Anime/Animation">Anime/Animation </option>
                  <option value="Action/Adventure ">Action/Adventure </option>
                  <option value="Classics">Classics</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Drama">Drama</option>
                  <option value="Family">Family</option>
                  <option value="Foreign">Foreign</option>
                  <option value="Horror">Horror</option>
                  <option value="Sci-Fi/Fantasy">Sci-Fi/Fantasy</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Shorts">Shorts</option>
                  <option value="Shows">Shows</option>
                  <option value="Trailers">ShTrailersorts</option>
               </select>
          <button
            className="bg-blue-600 rounded-md p-2 m-3 w-20 text-white"
            onClick={createVideo}
          >
            Submit
          </button>
        </div>
        <div className="flex flex-col">
          <div className="text-2xl m-3">Record Trend</div>
          <div className="text-left mx-2">Video Id</div>
          <input
            onChange={(e) => {
              setId(e.target.value);
            }}
            value={id}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Trend Id</div>
          <input
            onChange={(e) => {
              setTrendId(parseInt(e.target.value));
            }}
            value={trendId}
            type="number"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Country</div>
          <input
            onChange={(e) => {
              setCountry(e.target.value);
            }}
            value={country}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <div className="text-left mx-2">Trend Date</div>
          <input
            onChange={(e) => {
              setTrendDate(e.target.value);
            }}
            value={trendDate}
            type="date"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <button
            className="bg-blue-600 rounded-md p-2 m-3 w-20 text-white"
            onClick={recordTrend}
          >
            Submit
          </button>
        </div>
      </main>
    </>
  );
}
