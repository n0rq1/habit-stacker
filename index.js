const PORT = process.env.PORT || 8080;
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const habitRouter = require('./routers/habitRouter');

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: ['https://habithop.netlify.app', 'http://localhost:3000'], 
    credentials: true
}));

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({extended:true}));

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("DB Connected");
}).catch(err => {
    console.log("Error - didn't connect to DB");
})

app.get('/', (req,res) => {
    res.json({message: "Habit Stacker"});
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/habit', habitRouter);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
