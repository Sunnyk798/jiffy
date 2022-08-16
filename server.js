require("dotenv").config();
const express = require("express");

const connectDB = require("./db");
const userRouter = require("./routes/users");
const videoRouter = require("./routes/videos");

const app = express();
const PORT = process.env.PORT || 5050;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build"));
  });
}

app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);

app.listen(PORT, (err) => {
  if (err) console.log("Server failed ...");
  else console.log(`Server running on ${PORT}`);
});
