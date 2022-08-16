import "./Login.css";
import {signInWithPopup, GoogleAuthProvider} from 'firebase/auth';

export default function Login({auth, setAuthUser}) {

    const loginWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then(async (result) => {
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            var user = {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL
            }
            console.log(user.photoURL)

            var response = await fetch("/api/users/register",{
                method: "POST",
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                   },
                body: JSON.stringify(user)
            })
            var userProfile = await response.json();
            
            setAuthUser(userProfile);
            console.log(userProfile)
            localStorage.setItem("jifftyAuth",JSON.stringify(userProfile));
        }).catch(error => {
            const errorMessage = error.message;
            console.log(errorMessage);
        })
    }

	return (
		<div className='login-page'>
			<div className='large-logo'>Jiffty</div>
			<button onClick={loginWithGoogle} className='login-btn'>
				Login with Google
			</button>
		</div>
	);
}
