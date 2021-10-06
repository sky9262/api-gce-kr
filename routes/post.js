const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all data of post using GET "/api/post/read". Login dose not require
router.get('/read', async(req, res)=>{
    const postData = await Post.find({});
    
    res.json(postData)
});


//ROUTE 2: Post a new data in post using POST "/api/post/add". Login require
router.post('/add', fetchuser, [
    body('description', "Description must be atleast 10 character.").isLength({ min: 10 }),
    body('image', "Image can not be empty").notEmpty(),
    body('category', "Category can not be empty").notEmpty(),
    body('event_date', "Event date can not be empty").notEmpty(),
    body('subtitle', "Subtitle can not be empty").notEmpty(),
    body('title', "Title must be atleast 5 character.").isLength({ min: 5 }),
], async (req, res)=>{
    try {
        const  {title, subtitle, description, image, category, event_date, button, link, zoom} = req.body;
        // if there are error, return bad req and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const postData = new Post ({
            title, subtitle, description, image, category, event_date, button, link, zoom, user : req.user.id
        })
        const AddedPostData = await postData.save();
        res.json({"msg": "New post added sucessfully!!", AddedPostData})
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error while saving new post data!!");
    }
});


//ROUTE 3: Update a existing data of post using PUT "/api/post/update". Login require
router.put('/update/:id', fetchuser, async (req, res)=>{
    try {
        const  {title, subtitle, description, image, category, event_date, button, link, zoom} = req.body;

        // Create a new data to update post
        const newPost = {};
        if(title){newPost.title = title};
        if(description){newPost.description = description};
        if(image){newPost.image = image};
        if(button){newPost.button = button};
        if(link){newPost.link = link};
        if(subtitle){newPost.subtitle = subtitle};
        if(category){newPost.category = category};
        if(event_date){newPost.event_date = event_date};
        if(zoom){newPost.zoom = zoom};

        // find the node to be updated and update it
        let post = await Post.findById(req.params.id);
        if(!post) {return res.status(404).send("Not found")}

        post = await Post.findByIdAndUpdate(req.params.id, {$set: newPost}, {new:true});
        res.json({"msg": "Updated sucessfully!",post});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error while saving new post data!!");
    }
});

//ROUTE 4: Delete a existing data of post using DELETE "/api/post/delete". Login require
router.delete('/delete/:id', fetchuser, async (req, res)=>{
    try {
        // find the node to be deleted and delete it
        let post = await Post.findById(req.params.id);
        if(!post) {return res.status(404).send("Not found")}
        post = await Post.findByIdAndDelete(req.params.id);
        res.json({"msg": "Deleted sucessfully!",post});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error while saving new post data!!");
    }
});
module.exports = router