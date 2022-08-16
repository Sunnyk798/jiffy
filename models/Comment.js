const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Video'
        }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
