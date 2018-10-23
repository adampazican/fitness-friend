const Activity = require('../models/activity')

async function showActivities(req, res){
    try{
        const activity = new Activity()

        const { activities, numberOfPages} = (await activity.getAllByUserIdPaginated(req.user.id, req.query.type, req.params.page || 1))
        activities.map(activity => ({
            ...activity,
            date: activity.date.toISOString().slice(0, 10),
            time: activity.date.toISOString().slice(11, 19)
        }))

        res.render('index', { 
            activities,
            numberOfPages,
            user: req.user,
            filter: req.query.type,
            user_menu: req.query.user,
            activity_menu: req.query.activity
        })
    }
    catch(err){
        res.send('Error fetching activities, try again later!')
        console.log(err)
    }
}

async function showDetailActivity(req, res){
    const activity =  await (new Activity().getActivity(req.params.id).catch(err => res.send('error')))
    res.render('detail-activity', { activity, user: req.user })
}

function showNewActivity(req, res){ 
    res.render('new-activity', { user: req.user })
}

async function createActivity(req, res){
    try{
        const { type, description, duration1, duration2, time, date, place } = req.body
        const { id: userId } = req.user
        const duration = `${duration1} ${duration2}`
        const datetime = `${date} ${time}`
        const activity = new Activity()

        await activity.create(type, description, duration, datetime, place,  userId)
        res.redirect('/')
    }
    catch(err){
        res.send('Error creating activity')
    }
}

async function removeActivity(req, res){
    try{
        const { id } = req.params
        const activity = new Activity()

        await activity.remove(id)
        res.redirect('/')
    }
    catch(err){
        res.send('error removing activity')
        console.log(err)
    }
}

async function updateActivity(req, res){
    try{
        const { type, description, duration1, duration2, time, date, place } = req.body
        const { id } = req.params
        const duration = `${duration1} ${duration2}`
        const datetime = `${date} ${time}`
        const activity = new Activity()


        await activity.update(id, type, description, duration, datetime, place)
        res.redirect('/')
    }
    catch(err){
        res.send('Error updating activity')
        console.log(err)
    }
}

async function showUpdateActivity(req, res){
    const activity =  await (new Activity().getActivity(req.params.id).catch(err => res.send('error')))
    res.render('update-activity', {
        user: req.user,
        activity: {
            ...activity,
            date: activity.date.toISOString().slice(0, 10),
            time: activity.date.toISOString().slice(11, 19)
        }
    })
}

module.exports = {
    showActivities,
    showNewActivity,
    showDetailActivity,
    showUpdateActivity,
    createActivity,
    removeActivity,
    updateActivity
}