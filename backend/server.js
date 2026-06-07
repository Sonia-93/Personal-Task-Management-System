require('dotenv').config();
const express=require('express');
const app=express();
const config=require('config');
const connectDB=require('./config/db');
const taskRoutes=require('./routes/taskRoutes');
const userRoutes=require('./routes/userRoutes');
const authRoutes=require('./routes/authroutes');
const cors=require('cors'); 
const morgan=require('morgan');

console.log('MONGO_URI =', process.env.MONGO_URI);


connectDB();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
if(config.get('env')==='development'){
    app.use(morgan('dev'));
}
app.use('/api/tasks',taskRoutes);
app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);
const PORT=config.get('port');
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})