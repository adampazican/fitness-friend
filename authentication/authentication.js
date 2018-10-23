const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('../models/user')

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try{
            const user = new User()
            if(await !user.isUsernameTaken(username)) return done(null, false, { message: 'Incorrent username'})
            const targetUser = await user.getByUserName(username)

            
            if(!await user.authenticate(password, targetUser[0].password)){
                return done(null, false, { message: 'Incorrect password'})
            }

            return done(null, targetUser[0])
        }
        catch(err){
            return done(err)
        }
    }
))

passport.serializeUser((user, done) =>{ 
    done(null, user.id)})
  
passport.deserializeUser(async (id, done) => {
    const user = await new User().getById(id)
    done(null, user[0])
})

module.exports = { passport }