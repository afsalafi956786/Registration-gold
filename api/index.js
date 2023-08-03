import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDb from './connection/database.js'
import morgan from 'morgan';
import userRouter from './routes/User/auth.js';
import path from 'path';

const __dirname=path.resolve();
const app=express();
dotenv.config();

//connection mongodb
const port =process.env.PORT;

const DATABASE_URL=process.env.DATA_BASE_CONNECTION;
connectDb(DATABASE_URL);


//middleware
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))


app.use('/api/auth',userRouter);

app.use((err, req, res, next) => {
    console.log(err.message)
    res.status(500).json({message:'internal server error'})
})

//port
app.listen(port,()=>{
    console.log(`server running at the port is ${port}`)
})