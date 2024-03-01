import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/conn.js';
import userRoute from './routes/user.js'
import adminRoute from './routes/admin.js'
import districtRoute from './routes/district.js'

const app=express();
dotenv.config();

app.use(express.json());

connectDB();

app.use('/user',userRoute);
app.use('/admin',adminRoute);
app.use('/district',districtRoute);

app.get('/',(req,res) => {
    res.send('Root Page');
})

const PORT=process.env.PORT;

app.listen(PORT || 5000,()=> {
    console.log(`Server is listening at port ${PORT}`);
})