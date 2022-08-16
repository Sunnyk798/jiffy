const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User");
const Notification = require("../models/Notification")
const authorize = require("../middlewares/auth")

router.post("/register", async(req, res) => {
    try {
        var result = await User.findOne({email: req.body.email});
        if(!result){
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                profilePicture: req.body.photoURL
            })
            result = await newUser.save();
        }
        const {updatedAt, ...user} = result._doc;
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.status(200).json({...user, token});
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get("/notifications", authorize, async(req, res) => {
    try {
        // const noti = []
        const noti = await Notification.find().limit(8).exec()
        // const noti = await Notification.find({$or: [{for: req.authUser._id}, {by: {$in: req.authUser.following}}]}).limit(8).exec();
        return res.status(200).json(noti);
    } catch(err){
        res.status(500).json(err);
    }
})

router.put("/:id", async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body});
        res.status(200).json({status:"Success"});
    } catch(err){
        res.send(err);
    }
})

router.get("/:id", authorize, async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {updatedAt, ...other} = user._doc;
        const response = {profile: other};
        if(other.followers.includes(req.authUser.id)){
            response.isFollowing = true;
        } else {
            response.isFollowing = false;
        }
        res.status(200).json(response);
    } catch(err) {
        console.log(err)
        res.status(500).send(err);
    }
})

router.get("/:id/follow", authorize, async(req, res) => {
    try {
        const session = await User.startSession();
        await session.withTransaction(() => {
            return User.findByIdAndUpdate(req.params.id, {
                $push: {followers: req.authUser._id}
            });
        });
        await session.withTransaction(() => {
            return User.findByIdAndUpdate(req.authUser.id, {
                $push: {following: req.params.id}
            });
        });
        session.endSession();
        res.status(200).json({isFollowing : true});
    } catch(err) {
        res.status(500).json(err);
    }
})

router.get("/:id/unfollow", authorize, async(req, res) => {
    try {
        const session = await User.startSession();
        await session.withTransaction(() => {
            return User.findByIdAndUpdate(req.params.id, {
                $pull: {followers: req.authUser._id}
            });
        });
        await session.withTransaction(() => {
            return User.findByIdAndUpdate(req.authUser.id, {
                $pull: {following: req.params.id}
            });
        });
        session.endSession();
        res.status(200).json({isFollowing : false});
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;