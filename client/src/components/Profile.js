import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from "./Loading";
import "./Profile.css";

export default function Profile({ user }) {
    const [profile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    
    const token = user.token;
    const params = useParams();
    useEffect(()=>{
        fetch("/api/users/"+params.id,{
            headers : new Headers({ 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+token
               })
        })
			.then(res => res.json())
			.then(result => {
                setProfile(result.profile);
                setIsFollowing(result.isFollowing);
			});
    },[token, params.id])


    const followUser = () => {
        fetch("/api/users/"+profile._id+"/follow",{
            headers : new Headers({ 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+token
               })
        })
			.then(res => res.json())
			.then(result => {
                setIsFollowing(result.isFollowing);
			});
    }

    const unfollowUser = () => {
        fetch("/api/users/"+profile._id+"/unfollow",{
            headers : new Headers({ 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+token
               })
        })
			.then(res => res.json())
			.then(result => {
                setIsFollowing(result.isFollowing);
			});
    }

    if(!profile) return <Loading />;
	return (
        <div>
            <img src={profile.coverPicture} className="cover" alt={profile.name} />
            <div className='profile'>
                <img className='avatar' src={profile.profilePicture} alt={profile.name}/>
                <div>
                    <h2>{profile.name}</h2>
                    <p>{profile.tagline}</p>
                    <div className='subs'>
                        <span>{profile.followers.length}</span> Followers 
                        <span> {profile.following.length}</span> Following
                    </div>
                    {
                        (user._id === profile._id) ? (
                            <button className="grey-btn">Edit Profile</button>
                        ) : (
                            isFollowing ? 
                            <button onClick={unfollowUser} className="grey-btn">Unfollow</button>:
                            <button onClick={followUser} className="follow-btn">Follow</button>
                        )
                    }
                </div>
            </div>
        </div>
	);
}
