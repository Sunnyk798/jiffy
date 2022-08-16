const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    tagline: {
        type: String,
        default: "...",
        max: 100
    },
    profilePicture: {
        type: String,
        default: "https://i.pinimg.com/originals/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg"
    },
    coverPicture: {
        type: String,
        default: "https://theoheartist.com/wp-content/uploads/sites/2/2015/01/fbdefault.png"
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);