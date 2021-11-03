const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Team = require('../models/Team');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all data of team using GET "/api/team/read". Login dose not require
router.get('/read', async(req, res)=>{
    const teamData = await Team.find({});
    
    res.json(teamData)
});


//ROUTE 2: Post a new data in team using POST "/api/team/add". Login require
router.post('/add', fetchuser, [
    body('image2', "Image 2 can not be empty").not().isEmpty(),
    body('image1', "Image 1 can not be empty").not().isEmpty(),
    body('post_place', "Post place can not be empty").not().isEmpty(),
    body('post_name', "Post name can not be empt").not().isEmpty(),
    body('name', "Teammate name must be atleast 5 character.").isLength({ min: 5 }),
], async (req, res)=>{
    try {
        const  {name, image2, post_name, image1, post_place, facebook, portfolio, instagram, telegram, linkedin, email, campus_profile, github} = req.body;
        // if there are error, return bad req and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const teamData = new Team ({
            name, image2, post_name, image1, post_place, facebook, portfolio, instagram, telegram, linkedin, email, campus_profile, github, user : req.user.id
        })
        const AddedTeamData = await teamData.save();
        res.json({"msg": "New team added sucessfully!!", AddedTeamData})
    } catch (error) {
        res.status(500).send("Internal server error while saving new team data!!");
    }
});


//ROUTE 3: Update a existing data of team using PUT "/api/team/update". Login require
router.put('/update/:id', fetchuser, async (req, res)=>{
    try {
        const  {name, image2, post_name, image1, post_place, facebook, portfolio, instagram, telegram, linkedin, email, campus_profile, github} = req.body;

        // Create a new data to update team
        const newTeam = {};
        if(name){newTeam.name = name};
        if(post_name){newTeam.post_name = post_name};
        if(image1){newTeam.image1 = image1};
        if(image2){newTeam.image2 = image2};
        if(post_place){newTeam.post_place = post_place};
        if(portfolio){newTeam.portfolio = portfolio};
        if(facebook){newTeam.facebook = facebook};
        if(instagram){newTeam.instagram = instagram};
        if(telegram){newTeam.telegram = telegram};
        if(linkedin){newTeam.linkedin = linkedin};
        if(email){newTeam.email = email};
        if(campus_profile){newTeam.campus_profile = campus_profile};
        if(github){newTeam.github = github};

        // find the node to be updated and update it
        let team = await Team.findById(req.params.id);
        if(!team) {return res.status(404).send("Not found")}

        team = await Team.findByIdAndUpdate(req.params.id, {$set: newTeam}, {new:true});
        res.json({"msg": "Updated sucessfully!",team});
        
    } catch (error) {
        res.status(500).send("Internal server error while saving new team data!!");
    }
});

//ROUTE 4: Delete a existing data of team using DELETE "/api/team/delete". Login require
router.delete('/delete/:id', fetchuser, async (req, res)=>{
    try {
        // find the node to be deleted and delete it
        let team = await Team.findById(req.params.id);
        if(!team) {return res.status(404).send("Not found")}
        team = await Team.findByIdAndDelete(req.params.id);
        res.json({"msg": "Deleted sucessfully!",team});
        
    } catch (error) {
        res.status(500).send("Internal server error while saving new team data!!");
    }
});
module.exports = router