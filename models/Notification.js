const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
	{
		action: {
			type: String,
			required: true,
		},
		actor: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		for: {
			type: String,
		},
		by: {
			type: String,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
