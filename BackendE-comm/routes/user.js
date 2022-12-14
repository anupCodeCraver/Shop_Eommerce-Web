const router = require('express').Router();
const { verifyTokenAndAuthenticateisAdmin, verifyTokenAndisAdmin } = require('./verifyToken');
const User = require('../models/User')


router.put('/:id', verifyTokenAndAuthenticateisAdmin, async (req, res) => {
   if (req.body.password) {
      password.Cryptojs.AES.encrypt(
         req.body.password, process.env.PASSWORD_SECR).toString()
   }
   try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
         $set: req.body,
      },
         { new: true }
      );

      res.status(201).json(updatedUser);

   } catch (err) {
      res.status(400).json(err);
   }
})

//DELETE USER 
router.delete('/delete/:id', verifyTokenAndAuthenticateisAdmin, async (req, res) => {
   try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('User deleted succefully');

   } catch (err) {
      res.status(400).json('You Cannot Do that')
   }

})

//GET USER
router.get('/single/:id',verifyTokenAndisAdmin,async(req,res)=>{
   try{
      const user=await User.findById(req.params.id);
      res.status(200).json(user)
   }catch(err){
      res.status(404).json("Wrong"+err)
   }
})





//GET ALL USERS


router.get('/',verifyTokenAndisAdmin,async(req,res)=>{
  const query=req.query.new;
  
   try{
      const users=query ? await User.find().sort({_id:-1}).limit(1)  :await User.find();
      res.status(200).json(users)
   }catch(err){
      res.status(400).json(err)  
   }
});

//STAT USERS



router.get("/stats",verifyTokenAndisAdmin,async(req,res)=>{

const date=new Date();
const lastyear=new Date(date.setFullYear(date.getFullYear() -1))
try{

   const data=await User.aggregate([
      {$match:{createdAt:{$gte:lastyear}}},

      {
         $project:{
         month:{$month:'$createdAt'},
      },
   },
   {
      $group:{
         _id:"$month",
         total:{$sum:1},
      },
   }
   ]);
   res.status(200).json(data)
   
}catch(err){   
   res.status(500).json(err)
}
});

module.exports = router;