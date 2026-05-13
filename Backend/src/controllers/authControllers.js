import bcrypt from "bcryptjs";
import { db } from "../database/db.js"
import { generateToken } from "../utils/utils.js";
import { sendEmail } from "../utils/mail.js";
import { sendOtpToEmail } from "../utils/sendotptoemail.js";

const login = async (req, res) => {


  if (!req.body) return res.status(400).json({ "msg": "Empty body" })

  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ "msg": "missing email or password" })

  const stmt = db.prepare(`select id,email,password from users where email = ?`)
  const existinguser = stmt.get(email);

  if (!existinguser) return res.status(400).json({ "msg": "invalid email" })

  const isMatch = await bcrypt.compare(password, existinguser.password);

  if (!isMatch) return res.status(400).json({ "msg": "invalid password" })

  const claims = { id: existinguser.id, email: existinguser.email };
  const token = await generateToken({ claims })

  existinguser.token = token;
  res.cookie("token", token);


  return res.status(200).json(existinguser)
}

const register = async (req, res) => {

  if (!req.body) return res.status(400).json({ "msg": "Empty body" })

  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ "msg": "missing email or password or name" })

  const stmt = db.prepare(`select id,email from users where email = ?`)
  const existinguser = stmt.get(email);

  if (existinguser) return res.status(400).json({ "msg": "email already exists" })

  const hashedpassword = await bcrypt.hash(password, 10);

  const result1 = await sendOtpToEmail(email);

  const createUser = db.prepare(`insert into users(name,email,password,otp,otpExpiry) values (?,?,?,?,?)`) ;
  const result = createUser.run(name,email,hashedpassword,result1.otp,result1.otpExpiry);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    result:result1
  });

}


const sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  await sendOtpToEmail(email);

   res.status(200).json({
    success: true,
    message: "OTP sent successfully"
  });
}

const verifyEmail = async (req, res) => {


  const { name, email, password,otp} = req.body;

  if (!name || !email || !password) return res.status(400).json({ "msg": "missing email or password or name" })

  const stmt = db.prepare(`select id,email,otp from users where email = ?`)
  const existinguser = stmt.get(email);

  if(existinguser.otp > Date.now) return res.status(400).json({"msg":"otp expired"});

  console.log("otp:", null, typeof null);
console.log("otpExpiry:", null, typeof null);
console.log("isVerified:", 1, typeof 1);
console.log("email:", email, typeof email);

  const updateIsVerified = db.prepare(`update users set otp = ?, otpExpiry = ?, isVerified = ? where email = ?`);
  const result = updateIsVerified.run(null,null,1,email);



  res.status(200).json({
    success: true,
    message: "email verified successfully and registered"
  });

  return res.status(200).json({ "msg": "not registered" });
}


export const googleLogin = (req, res, next) => {
  next();
};


export const googleCallback = (req, res) => {
  res.redirect("/auth/profile");
};


export const getProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  return res.json({
    user: req.user,
  });
};


export const logoutUser = (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({
        message: "Logout failed",
      });
    }

    req.session.destroy(() => {
      res.redirect("/");
    });
  });
};



export { login, register, verifyEmail }