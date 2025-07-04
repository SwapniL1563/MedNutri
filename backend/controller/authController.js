import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import validator from 'validator';
import User  from '../models/userModel.js';

const generateAccessToken = (id) => {
    return jwt.sign({ id },process.env.JWT_SECRET, { expiresIn:"15m" });
}

const generateRefreshToken = (id) => {
    return jwt.sign({ id },process.env.JWT_REFRESH_SECRET, { expiresIn:"7d" });
}

// signup logic 
export const signup = async(req,res) => {
    try {
    const { name,email,password,age,gender,country,allergies,preferences,consent} = req.body;

    // check if an user exists with same credentials
    const user = await User.findOne({email});
    
    if(user) {
        return res.status(409).json({
            error:"User already exists"
        })
    }

    // if user doesn't exist then only check if email is valid
    if(!validator.isEmail(email)){
       return res.status(401).json({
            error : "Invalid Email"
        })
    }

    // Also check if consent is true then only create new user
    if(!consent) {
        return res.status(401).json({
            error : "Please check the consent and make it true"
        })
    }

    // if both are valid then hash the password 
    const hashpwd = await bcrypt.hash(password,10);

    // store the new user with same hash pwd in DB
    const newUser = await User.create({
        name,email,password:hashpwd,age,gender,country,allergies,preferences,consent
    }) 

    // now generate both jwt access token and refresh token for logged in user
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // store the refresh token in http-only cookies
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({token:accessToken, "msg" : "New user created successfully "});
    } catch (error) {
        console.error("Error Signup: ",error.message)
    }
}


// signin logic
export const sigin = async(req,res) => {
    try {
    const { email , password } = req.body;

    // check if user exist with credential
    const user = await User.findOne({email});

    if(!user) {
        return res.status(404).json({
            error:"User doesn't exist"
        });
    }

    // if user exists then compare its password with hashpwd
    const match = await bcrypt.compare(password,user.password);

    if(!match) {
        return res.status(401).json({
            error:"Invalid credentials"
        })
    }

     // now generate both jwt access token and refresh token for logged in user
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // store the refresh token in http-only cookies
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({token:accessToken, "msg" : "User Logged in  successfully "});
    } catch (error) {
       console.error("Signin Error: ",error.message) 
    }
}

// fetch user data
export const getUserData = async (req,res) => {
     try {
      const user = await User.findById(req.user._id).select("-password");
      if(!user) return res.status(404).json({
        "msg":"No user found"
      });

      res.json(user);
     } catch (error) {
        res.status(500).json({
            "message":"Unable to fetch User data", error:error.message
        })
     }
}

// refreshAccessToken logic
export const refreshAccessToken = ( req,res) => {
    // get the refresh token from cookie
    const token = req.cookies.refreshToken;

    if(!token) {
        return res.status(401).json({ error: "No refresh token provided"})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_REFRESH_SECRET);
        // if verified then generate new access token
        const accessToken = generateAccessToken(decoded.id);
        res.json({ token: accessToken });
    } catch(error){
        res.status(403).json({ error: "Invalid refresh token"});
    }
}


