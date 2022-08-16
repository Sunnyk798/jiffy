import { AiFillPlayCircle } from "react-icons/ai";
import "./VideoCard.css";
import { useNavigate } from 'react-router-dom';

function getUrl(name){
    return `https://firebasestorage.googleapis.com/v0/b/jiffty.appspot.com/o/${name}?alt=media`
}

export default function VideoCard({ video }) {
    const navigate = useNavigate();

    const handleVideoPlay = (e) => {
        navigate(`watch/${video._id}`)
    }

	return (
		<div className="videoCard">
			<div className='poster' onClick={handleVideoPlay}>
                <AiFillPlayCircle className="playicon" />
				<video src={getUrl(video.videoPath)} preload="metadata" />
			</div>
			<p className='title'>{video.title}</p>
			<small>{new Date(video.createdAt).toDateString()}</small>
		</div>
	);
}
