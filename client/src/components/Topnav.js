import "./Topnav.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineBell } from 'react-icons/ai'
import Notification from "./Notification";

export default function Topnav({navShow, setNavShow, user}) {
    const navigate = useNavigate();
    const [term, setTerm] = useState("");
    const [noti, setNoti] = useState(false);

    const searchHandler = (e) => {
        e.preventDefault();
        if(term === ""){
            alert("Type Something!");
            return;
        }
        navigate('/search/'+term);
    }

    function handleSidenav(){
        setNavShow(!navShow);
    }

	return (
		<div className='navbar'>
            <div onClick={handleSidenav} className='hamburger'><AiOutlineMenu /></div>
			<div className='brand'>Jiffty</div>
            <form onSubmit={searchHandler}>
                <input value={term} onChange={(e)=>{setTerm(e.target.value)}} type='text' placeholder='Search' className='searchbar' />
            </form>
            <AiOutlineBell className="bell" onClick={() => {setNoti(!noti)}} />
            <Notification user={user} noti={noti} />
		</div>
	);
}
