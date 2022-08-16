const express = require("express");
const router = express.Router();
const multer = require("multer");
const ffmpeg = require('ffmpeg');
const User = require("../models/User");
const Video = require("../models/Video");
const Notification = require("../models/Notification");
const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("../jiffty-service-account.json");
const authorize = require('../middlewares/auth');

const comment = require('./comment');
const save = require('./save');
router.use('/comment', comment);
router.use('/save', save);

// ---- Firebase Setup ----
initializeApp({
	credential: cert(serviceAccount),
	storageBucket: "jiffty.appspot.com",
});
const db = getFirestore();
const bucket = getStorage().bucket();

// ---- Multer Setup ----
const storage = multer.memoryStorage({
	destination: (req, file, cb) => {
		cb(null, "");
	}
});

const filename = (file) => {
    const { originalname } = file;
    return `${Date.now()}-${originalname}`;
}

const upload = multer({ storage });
const videoQueue = [];
var isUploaderFree = true;

router.post("/upload", upload.single("video"), async (req, res) => {
	try {
		if (!req.file) {
			console.log("No file");
			return res.json({ err: "No file" });
		}
        req.file.filename = filename(req.file);
        
        // const thumb = new ffmpeg(req.file.filename).takeScreenshots({
        //     count: 1,
        //     timemarks: ['2']
        // }, '/media')
        
        const blob = bucket.file(req.file.filename);
        const blobWriter = blob.createWriteStream({
            metadata: {
               contentType: req.file.mimetype
            }
         })
         blobWriter.on('error', (err) => {
            if(err){
                return res.status(500).send(err)
            }
         })

         blobWriter.on('finish', () => {
             console.log("uploaded");
            // res.status(200).send("File uploaded.")
         })
         blobWriter.end(req.file.buffer);

        var authUser = JSON.parse(req.body.author);
        console.log(authUser)
		const videoData = req.body;
		videoData.videoPath = req.file.filename;
        videoData.author = authUser._id
        
        // videoQueue.push(videoData.videoPath);
	    // if (isUploaderFree) uploadToCloud(videoQueue);
		const video = new Video(videoData);
		await video.save(function(err, createdVideo){
            const notification = new Notification({
                actor: authUser.name,
                action: "uploaded a new video.",
                by: authUser._id,
                url: "/watch/"+createdVideo._id
            });
            notification.save();
        });
        
		res.send("ok");
	} catch (e) {
		console.log("here", e);
		res.status(400).json({ err: e });
	}
});

// cloud uploading
// async function uploadToCloud(videoQueue) {
// 	while (videoQueue.length > 0) {
//         try{
//             console.log("Uploading " + videoQueue[0]);
//             await bucket.upload("media/" + videoQueue[0], {
//                 resumable: false,
//                 gzip: true,
//             });

//             videoQueue.shift();
//         } catch(e){
//             console.log(e);
//         }
// 	}
// }


router.get("/", authorize,  async (req, res) => {
	try {
		const videos = await Video.find({}).sort({createdAt: -1}).exec();
		res.json(videos);
	} catch (e) {
		console.log(e);
		res.status(500).json({ err: e });
	}
});

router.get("/search/:term", authorize,  async (req, res) => {
	try {
        const term = req.params.term;
		const videos = await Video.find({$text: {$search: term}}).populate('author').limit(10).exec();
		res.json(videos);
	} catch (e) {
		console.log(e);
		res.status(500).json({ err: e });
	}
});

router.get("/:id", authorize, async (req, res) => {
	try {
		const video = await Video.findByIdAndUpdate(req.params.id,{
            $inc: {
                views: 1
            }
        });
		var result = video._doc;
        const author = await User.findById(result.author);
        result.author = author._doc;
        res.json(result);
	} catch (e) {
		console.log(e);
		res.status(400).json({ err: e });
	}
});

// setInterval(() => {
//     if (isUploaderFree && videoQueue.length > 0) {
//         isUploaderFree = false;
//         uploadToCloud(videoQueue);
//         isUploaderFree = true;
//     }
// }, 60000);

module.exports = router;
