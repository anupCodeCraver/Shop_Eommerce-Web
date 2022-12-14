const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const userRoute=require('./routes/user');
const authRoute=require('./routes/auth');
const productRoute=require('./routes/product');
const cartRoute=require('./routes/cart');
const orderRoute=require('./routes/order');
const stripeRoute=require('./routes/stripe');
require('dotenv').config();
const cors=require('cors')


const app=express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("Db connection Successfull"))
    .catch((err)=>{
        console.log(err);
    });

app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/products',productRoute);
app.use('/api/cart',cartRoute);
app.use('/api/orders',orderRoute);
app.use('api/checkout',stripeRoute);       



app.listen(process.env.PORT || 5000,()=>{
    console.log(`Your Server is running on port 5000`);
})