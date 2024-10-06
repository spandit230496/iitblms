const jwt=require("jsonwebtoken")
const secret="123456"

const generateToken=(role,username,userId)=>{
    return jwt.sign({"username":username,"role":role,"userId":userId},secret,{"expiresIn":"1h"})
}

module.exports=generateToken