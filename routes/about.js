const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const About = require('../models/About');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all data of about using GET "/api/about/read". Login dose not require
router.get('/read', async(req, res)=>{
    const aboutData = await About.find({});
    
    res.json(aboutData)
});


//ROUTE 2: Post a new data in about using POST "/api/about/add". Login require
router.post('/add', fetchuser, [
    body('description', "Description must be atleast 10 character.").isLength({ min: 10 }),
    body('image', "Image can not be empty").exists(),
    body('event_date', "Event date can not be empty").exists(),
    body('title', "Title must be atleast 5 character.").isLength({ min: 5 }),
], async (req, res)=>{
    try {
        const  {title, description, image, event_date, button, link} = req.body;
        // if there are error, return bad req and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const aboutData = new About ({
            title, description, image, event_date, button, link, user : req.user.id
        })
        const AddedAboutData = await aboutData.save();
        res.json({"msg": "New about added sucessfully!!", AddedAboutData})
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error while saving new about data!!");
    }
});


//ROUTE 3: Update a existing data of about using PUT "/api/about/update". Login require
router.put('/update/:id', fetchuser, async (req, res)=>{
    try {
        const  {title, description, event_date, image, button, link} = req.body;

        // Create a new data to update about
        const newAbout = {};
        if(title){newAbout.title = title};
        if(description){newAbout.description = description};
        if(image){newAbout.image = image};
        if(button){newAbout.button = button};
        if(link){newAbout.link = link};
        if(event_date){newAbout.event_date = event_date};

        // find the node to be updated and update it
        let about = await About.findById(req.params.id);
        if(!about) {return res.status(404).send("Not found")}

        about = await About.findByIdAndUpdate(req.params.id, {$set: newAbout}, {new:true});
        res.json({"msg": "Updated sucessfully!",about});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error while saving new about data!!");
    }
});

//ROUTE 4: Delete a existing data of about using DELETE "/api/about/delete". Login require
router.delete('/delete/:id', fetchuser, async (req, res)=>{
    try {
        // find the node to be deleted and delete it
        let about = await About.findById(req.params.id);
        if(!about) {return res.status(404).send("Not found")}
        about = await About.findByIdAndDelete(req.params.id);
        res.json({"msg": "Deleted sucessfully!",about});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error while saving new about data!!");
    }
});
module.exports = router