import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDb from './connection/database.js'
import morgan from 'morgan';
import userRouter from './routes/user.js'

const app=express();
dotenv.config();

//connection mongodb
const port =process.env.PORT;
const DATABASE_URL=process.env.DATA_BASE_CONNECTION;
connectDb(DATABASE_URL);

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))


app.use('/api/user',userRouter);



//port
app.listen(port,()=>{
    console.log(`server running at the port is ${port}`)
})