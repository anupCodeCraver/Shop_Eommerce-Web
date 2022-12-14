const router = require('express').Router();
const { verifyTokenAndAuthenticateisAdmin, verifyTokenAndisAdmin,verifyToken } = require('./verifyToken');
const Cart = require('../models/Cart')

//ADD TO CART
router.post('/',verifyToken,async(req,res)=>{
    try{
    const cart=await new Cart(req.body);

    await cart.save();
    res.status(200).json(cart)
    }catch(err){
        res.status(400).json(err);
    }
})

//UPDATE Cart 
router.put('/:id', verifyTokenAndAuthenticateisAdmin, async (req, res) => {
   try {
      const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
         $set: req.body,
      },
         { new: true }
      );

      res.status(201).json(updatedCart);

   } catch (err) {
      res.status(400).json(err);
   }
})

//DELETE Cart 
router.delete('/delete/:id', verifyTokenAndAuthenticateisAdmin, async (req, res) => {
   try {
     const cart= await Cart.findByIdAndDelete(req.params.id);
     if(cart){

        res.status(200).json('Cart deleted succefully');
     }else{
      res.status(400).json('Cart not found   ');
     }

   } catch (err) {
      res.status(400).json('You Cannot Do that')
   }

})

//GET USER CART 
router.get('/single/:id',verifyToken, async(req,res)=>{
   try{
      const cart=await Cart.findById(req.params.id); 
      if(cart) res.status(200).json(cart);
      res.status(400).json("product not found")
   }catch(err){
      res.status(404).json(err)
   }
});
   




 //GET ALL Products


router.get('/',verifyTokenAndisAdmin,async(req,res)=>{
    try{
        const carts=await Cart.find();
        res.status(200).json(carts)
    }catch(err){
        res.status(400).json(err)
    }
});




module.exports = router;