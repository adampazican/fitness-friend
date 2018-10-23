const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
require('dotenv').config()
const db = require('./db')
const { createUser, showRegister, showLogin} = require('./controllers/user-controller')
const { showActivities, showNewActivity, showDetailActivity, showUpdateActivity,
    createActivity, removeActivity, updateActivity } = require('./controllers/activity-controller')
const { passport } = require('./authentication/authentication')

const app = express()

const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated())
        return next()
    res.redirect('/login')
}

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({ secret: 'secret' }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', isAuthenticated, showActivities)
app.get('/page-:page', isAuthenticated, showActivities)
app.get('/new', isAuthenticated, showNewActivity)
app.get('/update/:id', isAuthenticated, showUpdateActivity)
app.get('/detail/:id', isAuthenticated, showDetailActivity)
app.get('/remove/:id', isAuthenticated, removeActivity)

app.post('/activities/', isAuthenticated, createActivity)
app.post('/activities/:id', isAuthenticated, updateActivity)

app.get('/register', showRegister)
app.post('/register', createUser)
app.get('/login', showLogin)
app.get('/logout', isAuthenticated, (req, res) => {
    req.logout()
    res.redirect('/login')
})

app.post('/login', passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/fail',
}))


app.listen(3000, () => console.log('listening'))
