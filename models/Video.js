const mongoose = require("mongoose");

const VideoSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		likes: {
			type: Array,
            default: []
		},
		views: {
			type: Number,
            default: 1
		},
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
		videoPath: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

VideoSchema.index({title: 'text', description: 'text', 'author.name': 'text'})

module.exports = mongoose.model("Video", VideoSchema);
