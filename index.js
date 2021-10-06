const connectToMong = require("./db")
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');



dotenv.config();
connectToMong();
const app = express()
const port = process.env.PORT || 4000


app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());


//Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/about', require('./routes/about'))
app.use('/api/post', require('./routes/post'))
app.use('/api/team', require('./routes/team'))

app.listen(port, () => {
  console.log(`GCE-KR backend listening at http://localhost:${port}`)
})