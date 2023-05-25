import asynchandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
// @desc auth user/set token
// route POST / api/users/auth
// @access Public

const authUser = asynchandler(async(req,res)=>{
   const {email,password} = req.body;
   const user = await User.findOne({email});

   if(user && (await user.matchPassword(password))){
    generateToken(res,user._id);
    res.status(201).json({
        _id: user._id,
        name:user.name,
        email: user.email
    });
   }else{
    res.status(401);
    throw new Error('Invalid email or password')
   }
});

// @desc Register a new user
// route POST / api/users
// @access Public
const registerUser = asynchandler(async(req,res)=>{

    const {name,email,password} = req.body;
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400);
        throw new Error('user already exist');
    }

    const user = await User.create({
        name,
        email,
        password, 
    });
    if(user){
        generateToken(res,user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    }else{
        res.status(400);
        throw new Error('Invalid user data')
    }
});


// @desc Logout user
// route POST / api/users/logout
// @access Public
const logoutUser = asynchandler(async(req,res)=>{
   res.cookie('jwt', '',{
    httpOnly: true,
    expires: new Date(0)
   })
   res.status(200).json({message:"User logged out"})
});


// @desc Get user profile
// route GET /api/users/profile
// @access Private
const getUserProfile = asynchandler(async(req,res)=>{
    console.log(req.user);
    res.status(200).json({message:"User Profile"})
});


// @desc update user profile
// route PUT/api/users/profile
// @access Private
const updateUserProfile = asynchandler(async(req,res)=>{
    res.status(200).json({message:"Update user Profile"})
});

export {authUser,logoutUser,getUserProfile,updateUserProfile,registerUser}