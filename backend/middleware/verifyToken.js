const jwt=require("jsonwebtoken")
const secret="123456"

const verifyToken=(role)=>{
    return function (req,res,next){
        const token=req.headers["authorization"];

        if(!token) return res.status(401).send({"message":"Token is missing"})

        try{
            const decoded=jwt.verify(token.split(" ")[1],secret)
            if(decoded.role!=role){
                return res.status(403).send({"message":"You are not authorized"})
            }
            req.user=decoded
            next();
        }
        catch(error){
            return  res.status(401).send({"message":"Token is expired or invalid"})
        }
    }
}

module.exports=verifyToken