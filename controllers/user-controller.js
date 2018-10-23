const User = require('../models/user')

async function createUser(req, res){
    try{
        const { username, password } = req.body 

        const user = new User()

        await user.create(username, password)
        res.redirect('/')
    }
    catch(err){
        if(err === 'Username is already taken!'){
            return res.send('Username is already taken')
        }
        res.send('Error creating user, try again later!')
        console.log(err)
    }
}

function showRegister(req, res){
    res.render('register')
}

function showLogin(req, res){ 
    res.render('login')
}

module.exports = {
    createUser,
    showRegister,
    showLogin
}