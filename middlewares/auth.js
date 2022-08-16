const jwt = require("jsonwebtoken");
const User = require("../models/User")
require("dotenv").config();

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const {id} = await jwt.verify(token, process.env.JWT_SECRET);
        if(!id) {
            return res.status(403).send("Not Authorized");
        }
        const authUser = await User.findById(id);
        if(!authUser){
            return res.status(403).send("Not Authorized");
        }
        req.authUser = authUser;
        next();
    } catch(e){
        console.log(e)
        res.status(403).send(e);
    }
}