import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// app.use(
//     session({
//         secret:"secret",
//         resave: false,
//         saveUninitialized:true
//     })
// );

// app.use(passport.initialize());
// app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        /*
          Here you can:
          1. Check user in DB
          2. Create user if not exists
        */

        const user = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          picture: profile.photos?.[0]?.value,
        };

        return done(null,user)
        return done(null, profile);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user);
});


passport.deserializeUser((user, done) => {
  done(null, user);
});


export {passport};