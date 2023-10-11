import { API_URL } from "@/globals";
import { useState, useEffect } from "react";
import { UserInfo, Creative, CategoryFrequency } from "@/types";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={15}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function CreativeComponent() {
  const [title, setTitle] = useState("music");
  const [viewCount, setViewCount] = useState(1000);
  const [likeCount, setLikeCount] = useState(1000);
  const [dislikeCount, setDislikeCount] = useState(10000000);
  const [comments, setComments] = useState(10);
  const [limit, setLimit] = useState(5);

  const [channelData, setChannelData] = useState<Creative[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryFrequency[]>([]);

  const getData = async () => {
    const url = new URL(
      `${API_URL}/creative?title=${title}&viewCount=${viewCount}&likeCount=${likeCount}&dislikeCount=${dislikeCount}&comments=${comments}&limit=${limit}`
    );
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
      alert(response.statusText);
    } else {
      const data = (
        (await response.json()) as {
          result: Creative[][];
        }
      ).result;
      const d = data[0];
      console.log(d);

      setChannelData(d);

      const allCategories = [
        "Film & Animation",
        "Autos & Vehicles",
        "Music",
        "Pets & Animals",
        "Sports",
        "Short Movies",
        "Travel & Events",
        "Gaming",
        "Videoblogging",
        "People & Blogs",
        "Comedy",
        "Entertainment",
        "Education",
        "News & Politics",
        "Howto & Style",
        "Science & Technology",
        "Nonprofits & Activism",
        "Movies",
        "Anime/Animation",
        "Action/Adventure",
        "Classics",
        "Comedy",
        "Documentary",
        "Drama",
        "Family",
        "Foreign",
        "Horror",
        "Sci-Fi/Fantasy",
        "Thriller",
        "Shorts",
        "Shows",
        "Trailers",
      ];

      const newCategoryData = allCategories.map((category) => {
        return { name: category, count: 0 };
      });

      for (let i = 0; i < d.length; i++) {
        const category = d[i].Category;
        const index = allCategories.indexOf(category);
        if (index === -1) {
            continue;
        }
        newCategoryData[index].count += 1;
      }

      for (let i = 0; i < newCategoryData.length; i++) {
        if (newCategoryData[i].count === 0) {
            newCategoryData.splice(i, 1);
            i -= 1;
        }
      }

      setCategoryData(newCategoryData);
    }
  };

  return (
    <>
      <main className="flex w-screen flex-col justify-center items-center text-center">
        <h1 className="font-semibold text-xl">
          Channels with at least one trending video with the following
          properties
        </h1>
        <p>Video Title</p>
        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
          type="text"
          className="w-32 border-gray-400 border-2 p-1 m-2 rounded-md"
        />
        <p>Minimum Views</p>
        <input
          onChange={(e) => {
            setViewCount(parseInt(e.target.value));
          }}
          value={viewCount}
          type="number"
          className="w-32 border-gray-400 border-2 p-1 m-2 rounded-md"
        />
        <p>Minimum Likes</p>
        <input
          onChange={(e) => {
            setLikeCount(parseInt(e.target.value));
          }}
          value={likeCount}
          type="number"
          className="w-32 border-gray-400 border-2 p-1 m-2 rounded-md"
        />
        <p>Maximum Dislikes</p>
        <input
          onChange={(e) => {
            setDislikeCount(parseInt(e.target.value));
          }}
          value={dislikeCount}
          type="number"
          className="w-32 border-gray-400 border-2 p-1 m-2 rounded-md"
        />
        <p>Minimum Comments</p>
        <input
          onChange={(e) => {
            setComments(parseInt(e.target.value));
          }}
          value={comments}
          type="number"
          className="w-32 border-gray-400 border-2 p-1 m-2 rounded-md"
        />
        <p>Number of Channels to Return</p>
        <input
          onChange={(e) => {
            setLimit(parseInt(e.target.value));
          }}
          value={limit}
          type="number"
          className="w-32 border-gray-400 border-2 p-1 m-2 rounded-md"
        />
        <button
          className={`w-fit h-10 text-gray-900 bg-gray-100 text-xs p-2`}
          onClick={getData}
        >
          Get Advanced Database Program Data
        </button>
        <h1 className="font-semibold text-xl">
          Average Likes and Comments of Trending Videos vs Top YouTube Channels
        </h1>
        <ResponsiveContainer width="99%" height={500}>
          <BarChart
            width={500}
            height={300}
            data={channelData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ChannelTitle" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="AvgLikes" fill="#8884d8" />
            <Bar dataKey="AvgComments" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
        <h1 className="font-semibold text-xl">
          Number of Trending Videos vs Top YouTube Channels
        </h1>
        <ResponsiveContainer width="99%" height={500}>
          <BarChart
            width={500}
            height={300}
            data={channelData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ChannelTitle" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="NumTrending" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
        <h1 className="font-semibold text-xl">
          Channel Rank vs Top YouTube Channels
        </h1>

        <i>ChannelRank 1: AvgLikes &gt;= 1000000 AND NumTrending &gt;= 10</i>
        <i>ChannelRank 2: AvgLikes &gt;= 1000000 AND NumTrending &gt;= 2</i>
        <i>ChannelRank 3: AvgLikes &gt;= 500000</i>
        <i>ChannelRank 4: AvgLikes &gt;= 250000</i>
        <i>ChannelRank 5: AvgLikes &gt;= 100000</i>

        <ResponsiveContainer width="99%" height={500}>
          <BarChart
            width={500}
            height={300}
            data={channelData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ChannelTitle" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ChannelRank" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <h1 className="font-semibold text-xl">
          Most Common Categories among Channels Trending Videos
        </h1>

        <ResponsiveContainer width="99%" height={500}>
          <PieChart width={1000} height={1000}>
            <Pie
                width={1000}
                height={1000}
              data={categoryData}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={200}
              fill="#8884d8"
              dataKey="count"
              isAnimationActive={false}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </main>
    </>
  );
}
