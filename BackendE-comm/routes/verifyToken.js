const Jwt=require('jsonwebtoken');


const verifyToken=((req,res,next)=>{

const authHeader=req.headers.token;

if(authHeader){
const token=authHeader.split(" ")[1];
Jwt.verify(token,process.env.JSONWEBTOKEN_KEY,(err,data)=>{
if(err) res.status(403).json("Token is not Valid!");
req.user=data;
next();
})

}else{
  return res.status(401).json("You are not authenticated!")
}

})

const verifyTokenAndAuthenticateisAdmin=((req,res,next)=>{
   verifyToken(req,res,()=>{
    if(req.user.id===req.params.id || req.user.isAdmin){
        next();
    }else{
        res.status(403).json('You are not allowed to do that');
    }
   });
    
    });


    const verifyTokenAndisAdmin=((req,res,next)=>{
        verifyToken(req,res,()=>{
            if(req.user.isAdmin){
              next();
            }else{
res.status(500).json('You Cannot Do That!')
            }   
        })
    });

    
    

module.exports={verifyToken,verifyTokenAndAuthenticateisAdmin,verifyTokenAndisAdmin}