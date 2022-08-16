import { useState, useEffect } from 'react';
import "./CommentList.css";

export default function CommentList({user, videoId}) {
    const token = user.token;
    const [comments, setComments] = useState(null);
    const [comment, setComment] = useState("");

    const fetchComment = async() => {
        const response = await fetch(`/api/videos/comment/${videoId}`, {
            headers : new Headers({ 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+token
            }),
        })
        const result = await response.json();
        setComments(result);
        console.log(comments)
    }

    useEffect(() => {
        fetchComment();
    },[token])

    const commentHandler = async() => {
        if(comment === ""){
            alert("Comment cannot be empty!");
            return;
        }
        const response = await fetch(`/api/videos/comment/${videoId}`, {
            method: 'POST',
            headers : new Headers({ 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+token
            }),
            body: JSON.stringify({text: comment})
        })
        const result = await response.json();
        result.author = user;
        setComments([...comments, result]);
        setComment("")
    }

    const ShowComment = ({comments}) => {
        console.log(comments)
        if(!comments || comments == []) return "No comments to show"
        return (
            <div className='comments'>
                {comments && comments.map(comment => {
                    return (
                        <div key={comment._id} className='flex'>
                            <img src={comment.author.profilePicture} alt='avatar' />
                            <div>
                                <p className='bold'>{comment.author.name}</p>
                                <small>{new Date(comment.createdAt).toLocaleString()}</small>
                                <p>{comment.text}</p>
                            </div>
                        </div>
                    )
                })}
            </div> 
        )
    }

    return (
        <div className='comment-list'>
            <h2>Comments</h2>
            <div className='flex'>
                <input type='text' value={comment} onChange={(e) => {setComment(e.target.value)}} /> 
                <button onClick={commentHandler} className='grey-btn'>Comment</button>
            </div>
            <ShowComment comments={comments} />   
        </div>
    )
}
