import { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import "./VideoList.css";

export default function VideoList({ title, token }) {
	const [videos, setVideos] = useState([]);
    
	useEffect(() => {
		fetch("/api/videos",{
            headers : new Headers({ 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+token
               })
        })
			.then(res => res.json())
			.then(result => {
				console.log(result);
				setVideos(result);
			});
	}, [token]);

	return (
		<div className='video-list'>
			<div>{title}</div>
			<div className='list'>
				{videos.map(video => {
					return (
						<VideoCard
							key={video._id}
							video={video}
						/>
					);
				})}
			</div>
		</div>
	);
}
