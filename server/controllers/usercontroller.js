import pool from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({
    path:'.env'
})
async function hashPassword(password){
    return await bcrypt.hash(password,10)
}
async function isMatched(password,hashedPassword){
    return await bcrypt.compare(password,hashedPassword)
}
async function generateAccessToken(id){
    return jwt.sign({
        id:id,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
async function generateRefreshToken(id,email,username){
    return jwt.sign({
        id:id,
        email:email,
        username:username
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}
export const registerUser=async(req,res,next)=>{
   try {
    console.log("register user reached")
     const {username,email,password}=req.body;
     if(!username || !email || !password){
         return res.status(400).json({success:false,message:"All fields are required"})
     }
     console.log("data has been read")
     const user=await pool.query('SELECT * FROM  users WHERE email=$1 OR username=$2',[email,username] )
      console.log("query up and running")
     if(user.rows.length!==0){
         return res.status(400).json({success:false,message:"User already exists"})
     }
     console.log("user has been fetched")
     const hashedPassword=await hashPassword(password)
 
     await pool.query('INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING *',[username,email,hashedPassword])
     const userdata = user.rows[0]
    //  return res.status(200).json({success:true,message:"Success",data:userdata})

    next()
    
 }
   catch (error) {
    console.log(error.message)
    return res.status(401).json({success:false,message:error.message})
    
   }
}

export const loginUser=async(req,res)=>{
    try {
    const {username,email,password}=req.body;
     if(!username || !email || !password){
         return res.status(400).json({success:false,message:"All fields are required"})
     }
      const user=await pool.query(`SELECT * FROM  users WHERE email=$1 or username=$2`,[email,username] )
      console.log("User",user)
     if(user.rows.length===0){
         return res.status(400).json({success:false,message:"User doesnt exist.Register instead"})
     }
    const userdata = user.rows[0];
    const match = await isMatched(password, userdata.password);
    if (!match) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
    }
    console.log("UserData",userdata)
    const accesstoken=await generateAccessToken(userdata.id)
    const refreshtoken=await generateRefreshToken(userdata.id,userdata.email,userdata.username)


    await pool.query(
    'UPDATE users SET refreshtoken = $1 WHERE id = $2',
    [refreshtoken, userdata.id]
  );
    const options = {
    httpOnly: true,
    secure: true, 
    sameSite: 'none', 
  }
    return res.status(200).cookie('refreshToken',refreshtoken,options).cookie('accessToken',accesstoken,options).json({
        success:true,
        message:"User logged in successfully",
        user:userdata,accesstoken,refreshtoken
    })


        
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({success:false,message:"Unable to Login User"})
    }

}