const router = require("express").Router();
require('dotenv').config()
// const stripe = require("stripe")(process.env.STRIPE_KEY);
// const KEY = process.env.STR_KEY
const stripe = require("stripe")("sk_test_51LmWUzSBnY0kyVMOmbRr6P4aB9E6CpECkB3ltxDc1J5vhjqkqJMxPiubTdJ69jEOZnDtWFnHSVtwx9JGdVa7mak700ropKIg8D   ");
const uuid=require('uuid').v4


router.post("/checkpay", async(req, res) => {
  

let status,error;
try{
  const {product,token}=req.body
  let customer=await stripe.customer.create({
    email:token.email,
    source:token.id
  })
  const   key=uuid()
  
  const   charge=await stripe.charge.create({
    amount:product.price *100,
      currency:'usd',
      customer:customer.id,
      reciept_email:token.email,
      description:`purchesd the ${product.name  }`,
      shipping:{
        name:token.card.name,
        address:{
          line1: token.card.address_line1,
          line2: token.card.address_line2,
          city: token.card.address_city,
          country: token.card.address_country ,
          postal_code: token.card.address_zip,
        },  
      },
  },
  {
    key,
  }
  );  
  console.log("charge",{charge});
    status="success";
  
}
catch(err){
console.log(err);
status="failure"
}
res.json({error,status})
  
});

module.exports = router;





// const router = require("express").Router();
// const uuid=require('uuid').v4;
// // const stripe = require("stripe")(process.env.STRIPE_KEY);
// const KEY = process.env.STR_KEY
// const stripe = require("stripe")(KEY);
// const idempontenctKey=uuid()
// router.post("/payment", (req, res) => {
// try {
//   stripe.charges.create(
//     {
//       source: req.body.tokenId,
//       amount: req.body.amount,
//       description:'this is my first payment',
//       currency: "usd",
//     }, {idempontenctKey}   ,

//   );

// } catch (error) {
//   res.status(400).json(error)
// }
  
// });

// module.exports = router;
