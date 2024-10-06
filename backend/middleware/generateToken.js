const jwt=require("jsonwebtoken")
const secret="123456"

const generateToken=(role,username)=>{
    return jwt.sign({"username":username,"role":role},secret,{"expiresIn":"1h"})
}

module.exports=generateToken