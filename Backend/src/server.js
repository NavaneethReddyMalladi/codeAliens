import express, { urlencoded } from "express"
import passport from "Passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"

import { instantiateDatabase } from "./database/db.js";
import dotenv from "dotenv"

dotenv.config();

import authroutes from "./routes/authRoutes.js"
import problemroutes from "./routes/problemRoutes.js"

const app = express();
app.use(
    session({
        secret:"secret",
        resave: false,
        saveUninitialized:true
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:"http://localhost:3000/auth/google/callback",
        },
        (accessToken,refreshToken,profile,done)=> {
            return done(null,profile);
        }
        )
);

passport.serializeUser((user,done)=>done(null,user))
passport.deserializeUser((user,done)=>done(null,user))


instantiateDatabase();
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get("/",(req,res)=>{
    res.send("<a href='/auth/google'>login with google</a>")
})

app.use("/auth",authroutes);
app.use("/problems",problemroutes);

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})