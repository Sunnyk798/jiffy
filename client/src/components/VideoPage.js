import { AiFillPlayCircle, AiOutlineLike, AiFillLike, AiOutlineClockCircle, AiFillClockCircle } from "react-icons/ai";
import Loading from "./Loading";
import CommentList from "./CommentList";
import "./VideoPage.css";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';

function getUrl(name){
    return `https://firebasestorage.googleapis.com/v0/b/jiffty.appspot.com/o/${name}?alt=media`
}

export default function VideoPage({user}) {
    const token = user.token;
    const [currentVideo, setCurrentVideo] = useState(null);

    let params = useParams();
    useEffect(() => {
        console.log(params)
        async function fecthData(){
            try {
                const response = await fetch(`/api/videos/${params.id}`, {
                    headers : new Headers({ 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer '+token
                    })
                });
                const video = await response.json();
                if(video){
                    setCurrentVideo(video)
                }
            } catch(err){
                return <div>{err}</div>
            }
        }
        fecthData();
    },[params.id, token])

    const vidRef = useRef(null);
    const navigate = useNavigate();

    const [playing, setPlaying] = useState(false);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false)

    const handleVideoPlay = (e) => {
        e.preventDefault();
        if(playing){
            vidRef.current.pause();
            vidRef.current.controls = false;
            setPlaying(false);
        } else {
            vidRef.current.controls = true;
            vidRef.current.play();
            setPlaying(true);
        }
    }

    const handleLike = () => {
        setLiked(!liked);
    }

    const handleSave = () => {
        setSaved(!saved);
    }

    if(!currentVideo) return <Loading />

    return (
        <div className="player">
			<div className='poster' onClick={handleVideoPlay}>
                {!playing && <AiFillPlayCircle className="playicon" /> }
				<video ref={vidRef} src={getUrl(currentVideo.videoPath)}/>
			</div>
            <div className="desc">
                <div>
                    <p className='title'>{currentVideo.title}</p>
                    <p>{currentVideo.description}</p>
                    <small>{new Date(currentVideo.createdAt).toDateString()}  |  {currentVideo.views} views</small>
                </div>
                <div className="icons">
                    {liked ? <AiOutlineLike onClick={handleLike} />: <AiFillLike onClick={handleLike} /> } Like
                    {saved ? <AiOutlineClockCircle onClick={handleSave} />: <AiFillClockCircle onClick={handleSave} /> } Save
                </div>
            </div>
            <div className="author">
                <div className="identity">
                    <img src={currentVideo.author.profilePicture} alt="avatar" className="avatar" />
                    <div>
                        <span className="author-name">{currentVideo.author.name}</span><br />
                        <span>{currentVideo.author.followers.length} Followers</span>  | 
                        <span> {currentVideo.author.following.length} Following</span> 
                    </div>
                </div>
                <button onClick={() => {navigate('/profile/'+currentVideo.author._id)}} className="grey-btn">View Profile</button>
            </div>
            <CommentList user={user} videoId={params.id} />
            <div className="sized-box"></div>
            <div className="sized-box"></div>
            <div className="sized-box"></div>
		</div>
    )
}
