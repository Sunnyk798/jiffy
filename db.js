const mongoose = require("mongoose");
require("dotenv").config();

module.exports = function connectDB() {
	mongoose.connect(
		process.env.MONGO_URL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
            useFindAndModify: false
		},
		err => {
			if (err) console.log("DB connection failed...");
			else console.log("DB connected ...");
		}
	);
};
