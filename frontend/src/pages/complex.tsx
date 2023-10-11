import { useEffect, useState } from "react";
import { ChannelType, VideoType} from "../types"
import { API_URL } from "../globals";
import { Limelight } from "@next/font/google";

export default function Complex() {
    const [selectedOption, setSelectedOption] = useState<number>(1);
    const [queryResult1, setQueryResult1 ] = useState<ChannelType[]>([]);
    const [queryResult2, setQueryResult2 ] = useState<VideoType[]>([]);
    const [text1, setText1] = useState<string>("music")
    const [text2, setText2] = useState<string>("sport")
    const [limit, setLimit] = useState<number>(15);
  
    const firstQuery = async ()=>{
        const url = new URL(`${API_URL}/aggregateWithInput1?keyword1=${text1}&limit=${limit}`);
        const response = await fetch(url, {credentials:'include'});
        if (!response.ok) {
            //console.log(response.statusText);
        }
        const channelsResponse = (await response.json()) as {
            result: ChannelType[];
        };
        setQueryResult1(channelsResponse.result);
    }

    const secondQuery = async()=>{
        const url = new URL(`${API_URL}/aggregateWithInput2?keyword1=${text1}&keyword2=${text2}&limit=${limit}`);
        const response = await fetch(url, {credentials:'include'});
        if (!response.ok) {
            console.log(response.statusText);
        }
        const videoResponse = (await response.json()) as {
            result: VideoType[];
        };
        setQueryResult2(videoResponse.result);
    }


    const renderResult1 = () =>{
        if(selectedOption===1) {
            return (queryResult1.map((r, id)=>{
                return(
                    <div className='bg-gray-100 rounded-md hover:bg-gray-200 duration-200 my-3 p-3' key={r.id}>
                        {id+1})
                        <p>Title: {r.channelTitle}</p>
                        <p>Likes: {r.avgLikes}</p>   
                        <p>Comments: {r.avgComments}</p>
                    </div>
                )
            }))
        }
    };
    const renderResult2 = () =>{
        if(selectedOption===2) {
            return (queryResult2.map((r, id)=>{
                return(
                    <div className='bg-gray-100 rounded-md hover:bg-gray-200 duration-200 my-3 p-3' key={r.id}>
                        {id+1})
                        <p>Title: {r.title}</p>
                        <p>Likes: {r.likes}</p> 
                    </div>
                )
            }))
        }
    };

    const changeOption = (newOption: number) => {
        setSelectedOption(newOption);
        if(newOption === 1){
            firstQuery();
        }
        else{
            secondQuery();
        }
    }

    return (
        <>
        <main className="w-screen h-screen flex items-start justify-center">
            <div className='flex flex-col items-center justify-center'>
            <p>Our website can be utilized to determine trends in YouTube&apos;s trending history. Below returns the top videos/channels based on keywords</p>
            
            <p>Keyword 1</p>
            <input
            onChange={(e) => {
              setText1(e.target.value);
            }}
            value={text1}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <p>Keyword 2</p>
          <input
            onChange={(e) => {
              setText2(e.target.value);
            }}
            value={text2}
            type="text"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
          <p>Limit</p>
          <input
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
            }}
            value={limit}
            type="number"
            className="border-gray-400 border-2 p-1 m-2 rounded-md"
          />
            <div className="w-60 flex flex-row justify-center border-2 rounded-md">
                <button className = {`w-6/12 text-gray-900 ${selectedOption === 1 && "bg-slate-200"} text-xs`} onClick={() => changeOption(1)}>
                    Top {limit} Channels with most likes in videos with tag containing &quot;{text1}&quot;, more than 100000 views, and more than 100000 likes
                </button>
                <button className = {`w-6/12 text-gray-900 ${selectedOption === 2 && "bg-slate-200"} text-xs`} onClick={() => changeOption(2)}>
                Top {limit} Videos with most likes and title, tag, or description containing &quot;{text1}&quot; or &quot;{text2}&quot;
                </button>
            </div>
            <div>
                {(selectedOption===1)? renderResult1(): renderResult2()}
            </div>
            </div>
        </main>
        </>
    );
}