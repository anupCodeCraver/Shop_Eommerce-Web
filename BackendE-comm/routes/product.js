const router = require('express').Router();
const { verifyTokenAndAuthenticateisAdmin, verifyTokenAndisAdmin } = require('./verifyToken');
const Product = require('../models/Product')

//ADD NEW PRODUCT
router.post('/',verifyTokenAndisAdmin,async(req,res)=>{
    try{
    const newProduct=await new Product(req.body);

    await newProduct.save();
    res.status(200).json(newProduct)
    }catch(err){
        res.status(400).json(err);
    }
})

//UPDATE PRODUCT [ONLY ADMIN]
router.put('/:id', verifyTokenAndisAdmin, async (req, res) => {
   try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
         $set: req.body,
      },
         { new: true }
      );

      res.status(201).json(updatedProduct);

   } catch (err) {
      res.status(400).json(err);
   }
})

//DELETE PRODUCT [ONLY ADMIN] 
router.delete('/delete/:id', verifyTokenAndisAdmin, async (req, res) => {
   try {
     const product= await Product.findByIdAndDelete(req.params.id);
     if(product){

        res.status(200).json('Product deleted succefully');
     }else{
      res.status(400).json('product not found   ');
     }

   } catch (err) {
      res.status(400).json('You Cannot Do that')
   }

})

//GET SINGLE PRODUCT 
router.get('/single/:id',async(req,res)=>{
   try{
      const product=await Product.findById(req.params.id); 
      if(product){

         res.status(200).json(product);
      }else{

         res.status(400).json("product not found")
      }
   }catch(err){
      res.status(404).json(err)
   }
});
   




 //GET ALL Products


router.get('/',async(req,res)=>{
  const qnew=req.query.new;
  const qcategory=req.query.category;
   try{
    let products;
    if(qnew){
    
    products=await Product.find().sort({createdAt:-1}).limit(5)
    }else if(qcategory){
         products=await Product.find({categories:{
            $in:[qcategory],
        }})
      //   console.log("qcategory log");
    }else{
      
         products=await Product.find()
      //   console.log("ELSE PART log");
      //   console.log(products);
    }
res.status(200).json(products)
   }catch(err){   
      res.status(400).json(err)  
   }
});







module.exports = router;