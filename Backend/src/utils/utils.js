import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const generateToken = async ({claims})=>{
    const token = await jwt.sign(claims,process.env.JWT_SECRET,{expiresIn:"7d"})
    return token;
}

export {generateToken}