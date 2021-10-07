const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
var sha256 = require('js-sha256').sha256;


//ROUTE 1: Create a User using POST "/api/auth/signup". Dosen't require Auth
router.post('/signup', [
    body('name', "Name length can not be less than 3.").isLength({ min: 3 }),
    body('email', "Please enter a valid email").isEmail(),
    body('password', "Password must be atleast 5 character.").isLength({ min: 5 }),
    body('secret_code', "Secret code must be atleast 6 character.").isLength({ min: 6 }),
], async (req, res)=>{
    // if there are error, return bad req and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ "msg": errors.array() });
    }
    if(sha256(req.body.secret_code).toUpperCase() != process.env.SECTRET_CODE) {
        return res.status(401).json({ "msg": "Wrong secret code!!"});
      }
    //check wether user exists already
    try {
        let user = await User.findOne({email: req.body.email});
        if (user){
            return res.status(400).json({ "msg":[{"msg": "User already exist!!"}]});
        }
        //create secure password before create a new user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //create new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            image: req.body.image,
            password: secPass,
        });

        res.json({"msg": "User created sucessfully!"}); 
    } catch (error) {
        res.status(500).send("Internal server error!!");
    }
});


//ROUTE 2: Authenticate a User using POST "/api/auth/login". Dosen't require Auth
router.post('/login', [
    body('email', "Please enter a valid email").isEmail(),
    body('password', "Password can not be blank").exists()
], async (req, res)=>{
    // if there are error, return bad req and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ msg: "Incorrect email id or password!!"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(401).json({ msg: "Incorrect email id or password!!"});
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECTRET);

        res.json({"msg": `Login sucessfully as ${user.name}!`,authToken, "name":`${user.name}`,image:`${user.image}`}); 


    } catch (error) {
        res.status(500).send("Internal server error!!");
    }

})



//ROUTE 3: Get loggedin user details using POST "/api/auth/getuser". Login require
router.post('/user', fetchuser,  async (req, res)=>{
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if (!user){
            return res.status(401).json({ "msg":[{"msg": "Unauthorized!!"}]});
        }
        res.send({"status":true,user})
    } catch (error) {
        res.status(500).send("Internal server error!!");
    }
})

module.exports = router
