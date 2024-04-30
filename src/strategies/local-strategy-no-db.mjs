import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

// serializeUser is to store that user data into session in this case user ID
passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id);
});

// deserializeUser is we take that id unpack reveal
// who that user is that we are able take that object
// we retrieve via id and store that user object into request object itself
// here we search for user in our database or in this example our user array
passport.deserializeUser((id, done) => {
  console.log(`Inside Desirializer`);
  console.log(`Deserializing User ID: ${id}`);
  try {
    const findUser = mockUsers.find((user) => user.id === id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  // verify function
  new Strategy((username, password, done) => {
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    try {
      const findUser = mockUsers.find((user) => user.username === username);
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password)
        throw new Error("Invalid Credentials");
      // if user is found we use done function
      // to pass in (null) as no error and findUser object
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);

// if you want to authenticate
// user with email you will need to write like this
// then when user start authentication passport will
// look for email field in request body and set that as
// argument for username
/*
passport.use(
  new Strategy({ usernameField: "email" }, (username, password, done))
);
*/
