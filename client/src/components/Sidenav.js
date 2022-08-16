import {
	AiOutlineHome,
	AiOutlineUser,
	AiOutlineClockCircle,
	AiOutlineLogout,
	AiOutlineUpload,
} from "react-icons/ai";
import "./Sidenav.css";
import { Link } from "react-router-dom";

export default function Sidenav({navShow, user}) {
    const myProfile = "/profile/"+user._id;

    const handleLogout = () => {
        localStorage.removeItem('jifftyAuth')
    }
	return (
		<div className={'sidenav '+ (navShow ? '':'hide')}>
			<Link to="/">
				<AiOutlineHome className='icon' />
				<small>Home</small>
			</Link>

			<Link to={myProfile}>
				<AiOutlineUser className='icon' />
				<small>Profile</small>
			</Link>

			<Link to="/saved">
				<AiOutlineClockCircle className='icon' />
				<small>Saved</small>
			</Link>

			<a onClick={handleLogout} href="/">
				<AiOutlineLogout className='icon' />
				<small>Logout</small>
			</a>

			<Link to="/upload" className="upload-icon">
				<AiOutlineUpload className='icon' />
				<small>Upload</small>
			</Link>
		</div>
	);
}
