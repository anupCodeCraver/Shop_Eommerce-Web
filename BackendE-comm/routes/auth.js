const router=require('express').Router();
const User=require('../models/User');
const Cryptojs=require('crypto-js');
const Jwt=require('jsonwebtoken');

//RESISTER NEW USER
router.post('/register',async(req,res)=>{
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:Cryptojs.AES.encrypt(req.body.password,process.env.PASSWORD_SECR).toString()
    });
    try{
        const savedUser=await newUser.save();
       
        res.status(201).json(savedUser)
    }catch(err){
        res.status(500).json(err)
    }

});

router.post('/login',async(req,res)=>{
    try{  
    
    const isRegistered=await User.findOne({username:req.body.username});
    !isRegistered && res.status(401).json({result:'Wrong credential'});

    const hashedPassword=Cryptojs.AES.decrypt(isRegistered.password,process.env.PASSWORD_SECR);
     
    const Originalpassword=hashedPassword.toString(Cryptojs.enc.Utf8);

    Originalpassword !== req.body.password && res.status(401).json({result:'Wrong credential'});

const accessToken=Jwt.sign({id:isRegistered._id,isAdmin:isRegistered.isAdmin},process.env.JSONWEBTOKEN_KEY,{expiresIn:'5d'})

const {password,...others}=isRegistered._doc

    res.status(200).json({...others,accessToken})
}catch(err){
    res.status(500).json({err:err});
}


})


module.exports=router;