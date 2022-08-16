import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from './Loading';
import "./Search.css";

export default function Search({token}) {
    const params = useParams();
    const [result, setResult] = useState(null);

    useEffect(() => {
        async function fetchResult(){
            const response = await fetch(`/api/videos/search/${params.term}`, {
                headers : new Headers({ 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer '+token
                })
            });
            const videos = await response.json();
            setResult(videos)
        }
        fetchResult();
    }, [params.term])

    if(!result) return <Loading />
    return (
        <div className='search'>
            <h2>Results</h2>
            <div className='results'>
                {result.length == 0 ? 'No result found': 
                result.map(video => {
                    return (
                        <Link to={"/watch/"+video._id}>
                            <h2>{video.title}</h2>
                            <span>By: {video.author.name}</span>
                        </Link>
                    )
                })
                }
            </div>
        </div>
    )
}
