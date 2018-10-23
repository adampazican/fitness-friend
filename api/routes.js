const router = require('express').Router()
const Activity = require('../models/activity')
const User = require('../models/user')
const { passport } = require('../authentication/authentication')


const activity = new Activity()
const user = new User()


/**
 * Pre autentifikaciu api requestov potrebujeme v body parametre username a password
 */
const authenticate = async (req, res, next) => {
    const { username, password } = req.body
    
    const targetUser = (await user.getByUserName(username))
    if(targetUser.length === 0 || !await user.authenticate(password, targetUser[0].password)){
        return res.json({ error: 'bad credentials' })
    }

    res.locals.user = targetUser[0]
    next()
}


router.post('/activities/', authenticate, async (req, res) => {
    try{
        res.json(await activity.getAllByUserId(res.locals.user.id))
    }
    catch(err){
        return res.json({ error: 'bad request' })
    }
})

router.post('/activities/:id', authenticate, async (req, res) => {
    try{
        res.json((await activity.getActivity(req.params.id, res.locals.user.id)))
    }
    catch(err){
        return res.json({ error: 'bad request' })
    }
})



module.exports = router