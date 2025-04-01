const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({extended:true}));

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("DB Connected");
}).catch(err => {
    console.log("Error");
})

app.get('/', (req,res) => {
    res.json({message: "hello"});
})

app.listen(process.env.PORT, ()=>{
    console.log("listening");
})