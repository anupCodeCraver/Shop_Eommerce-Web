const router = require('express').Router();
const { verifyTokenAndAuthenticateisAdmin, verifyTokenAndisAdmin,verifyToken } = require('./verifyToken');
const Order = require('../models/Order')

//ADD ORDER
router.post('/',verifyToken,async(req,res)=>{
    try{
    const order=await new Order(req.body);

    await order.save();
    res.status(200).json(order)
    }catch(err){
        res.status(400).json(err);
    }
})

//UPDATE ORDER 
router.put('/:id', verifyTokenAndisAdmin, async (req, res) => {
   try {
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
         $set: req.body,
      },
         { new: true }
      );

      res.status(201).json(updatedOrder);

   } catch (err) {
      res.status(400).json(err);
   }
})

//DELETE ORDER 
router.delete('/delete/:id', verifyTokenAndisAdmin, async (req, res) => {
   try {
     const order= await Order.findByIdAndDelete(req.params.id)
        res.status(200).json('Order deleted succefully');

   } catch (err) {
      res.status(400).json('You Cannot Do that')
   }

})

//GET USER ORDER 
router.get('/single/:id',verifyTokenAndisAdmin, async(req,res)=>{

   try{
      const order=await Order.findById(req.params.id); 
     res.status(200).json(order);
    
   }catch(err){
      res.status(404).json(err)
   }
});


 //GET ALL ORDERS


router.get('/',verifyTokenAndisAdmin,async(req,res)=>{
    try{
        const orders=await Order.find();
        res.status(200).json(orders)
    }catch(err){
        res.status(400).json(err)
    }
});


router.get('/income',verifyTokenAndisAdmin,async(req,res)=>{
    const date=new Date();
    const lastMonth=new Date(date.setMonth(date.getMonth)-1)
    const previousMonth=new Date(new Date(lastMonth.getMonth()-1));

try {
    const allIncome=await Order.aggregate([
        {$match:{createdAt:{$gte:previousMonth}}},
        {
            $project:{
                month:{$month:"$createdAt"},
                sales:"$amount",
            }
        },
        {
            $group:{
                _id:"$month",
                total:{$sum:"$sales"}
            }
        }
    ]);
    res.status(200).json(allIncome)
} catch (error) {
    res.status(400).json(error)
}

})


module.exports = router;