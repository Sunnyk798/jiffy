const router = require('express').Router();
const authorize = require('../middlewares/auth');
const Comment = require('../models/Comment');

router.get('/:id', authorize, async (req, res) => {
    try {
        const videoId = req.params.id;
        const comments = await Comment.find({videoId}).populate('author').exec();
        res.json(comments);
    } catch(e){
        console.log(e);
        res.status(500).send();
    }
})

router.post('/:id', authorize, async (req, res) => {
    try {
        console.log(req.params)
        const payload = {
            text: req.body.text,
            videoId: req.params.id,
            author: req.authUser._id
        }
        console.log(payload);
        const newComment = new Comment(payload);
        const comment = await newComment.save();
        res.json(comment);
    } catch(e){
        console.log(e);
        res.status(500).send();
    }
})

module.exports = router;
