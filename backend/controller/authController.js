const User = require("../model/userSchema");
const generateToken=require("../middleware/generateToken")
const bcrypt=require("bcrypt")


const addUser = async (req, res) => {
    const { username, password, role } = req.body;
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(password, 10)


    try {

        const existingUser = await User.findOne({ "username": username })

        if (existingUser) {
            res.status(201).json({ "message": "User is already registered ", success: false });
            return
        }


        const new_user = new User({
            username, password: hashedPassword, role
        });

        await new_user.save();

        res.status(201).json({ "message": "User Registered successfully", success: true });



    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};


const loginUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {

    const existingUser = await User.findOne({ username: username });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if(existingUser.role!=role){
      return res.status(403).json({ message: "use correct role for login" ,succes:false});
    }

    if(!existingUser.isActive){
      return res.status(403).json({ message: "Your Account HAs Been Deleted,Contact Admin" ,succes:false});
    }

    console.log({existingUser})

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    
    token= generateToken(role,username,existingUser._id)
    

    return res.status(200).json({ message: "Login successful", token: token,success:true,role:existingUser.role});
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

module.exports = { loginUser,addUser };
