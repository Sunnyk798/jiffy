const router = require('express').Router();
const authorize = require('../middlewares/auth');
const User = require('../models/User');

router.post('/:id', authorize, async (req, res) => {
    try {
        User.findByIdAndUpdate(req.authUser._id, {
            $push: {saved: req.params.id}
        })
        res.status(200).json({saved: true});
    } catch(e){
        console.log(e);
        res.status(500).send();
    }
})



module.exports = router;
