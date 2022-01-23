var jwt = require('jsonwebtoken');
const JWT_SECTRET = process.env.JWT_SECTRET

const fetchuser = (req, res, next)=>{
    //Get the user from the jwt token and add it to req obj
    const token = req.header("auth-token");
    if(!token){
        res.status(401).send({ errors: "Please authenticate using a valid token!!"});
    }

    try {
        const data = jwt.verify(token,JWT_SECTRET);
        req.user = data.user;
        console.log("check")
        console.log(data)
        console.log("checked")
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token!!"});
    }
}


module.exports = fetchuser;
