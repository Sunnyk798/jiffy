import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import axios from "axios";
import "./Upload.css";

export default function Upload({user}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();
    const uploadDisabled = useRef(false);
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

	const currentFile = watch("video");

	async function submitHandler(data) {
		try {
            uploadDisabled.current = true;
			let url = "/api/videos/upload";
			let postData = new FormData();
			postData.append("title", data.title);
			postData.append("description", data.description);
			postData.append("video", data.video[0]);
            postData.append('author', JSON.stringify(user))

			const response = await axios.post(url, postData,{
                onUploadProgress: (progressEvent) => {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    setProgress(progress.toFixed(2));
                },    
            });
			console.log(response);
			alert("Video uploaded successfully!");
            navigate('/')
		} catch (e) {
            uploadDisabled.current = false;
            alert("Failed to upload!");
			console.log(e);
		}
	}

	return (
		<div className='upload'>
			<h3>Upload video</h3>

			<form onSubmit={handleSubmit(submitHandler)}>
				<div className='file-flex'>
					<label className='upload-ref' htmlFor='video-upload'>
						<AiOutlineVideoCameraAdd />
					</label>
					<input
						type='file'
						accept='video/mp4,video/*'
						className='file-upload'
						id='video-upload'
						{...register("video", {
							required: "This field is required.",
						})}
					/>
					<div className='file-preview'>
						{currentFile ? (
							<video
								height='120'
								src={URL.createObjectURL(currentFile[0])}
								type={currentFile[0].type}
							/>
						) : (
							<p style={{ padding: "0 1rem" }}>Preview</p>
						)}
					</div>
				</div>

				{errors.video && <small>{errors.video.message}</small>}

				<br />

				<label htmlFor='title-upload'>Title </label>

				<input
					type='text'
					maxLength='200'
					className='title-upload'
					id='title-upload'
					{...register("title", {
						required: "This field is required.",
						maxLength: { value: 150, message: "Max length exceeded." },
					})}
				/>

				{errors.title && <small>{errors.title.message}</small>}

				<br />

				<label htmlFor='desc-upload'>Description </label>

				<textarea
					className='desc-upload'
					id='desc-upload'
					{...register("description", {
						required: "This field is required.",
					})}></textarea>

				{errors.description && <small>{errors.description.message}</small>}

				<br />
                {uploadDisabled.current && <span>Uploading : {progress} %</span>}
				<input disabled={uploadDisabled.current} className='upload-btn' value={uploadDisabled.current ? 'UPLOADING':'UPLOAD'} type='submit' />
			</form>
		</div>
	);
}
