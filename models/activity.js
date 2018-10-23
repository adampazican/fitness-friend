const db = require('../db')

class Activity{
    async getAllByUserIdPaginated(userId, filter, page){
        const allActivities = await this.getAllByUserId(userId, filter)
        const numberOfPages = Math.ceil(allActivities.length / 6)
        page = numberOfPages >= page ? page : 1

        const start = (6 * (page-1))
        
        let end = (6 * page)

        end = end > allActivities.length ? allActivities.length : end
        
        return {
            numberOfPages,
            activities: allActivities.slice(start, end)
        }
    }

    async getAllByUserId(userId, filter){
        const type = filter === undefined || filter === 'all' ? '' : `AND type='${filter}'`
        const userSQL = `SELECT * FROM activities WHERE userId='${userId}' ${type} ORDER BY date DESC;`
        return await db.query(userSQL)
    }
    
    async create(type, description, duration, date, place, userId) {
        const activitySQL = `INSERT INTO activities (type, description, duration, date, place, userID) VALUES
            ('${type}','${description}', '${duration}', '${date}', '${place}', ${userId});`

        await db.query(activitySQL)
    }

    async remove(id){
        const activitySQL = `DELETE FROM activities WHERE id=${id};`
        await db.query(activitySQL)
    }

    async getActivity(id, userId){
        const userIdFilter = userId ? `AND userId='${userId}'` : ''
        const activitySQL = `SELECT * FROM activities WHERE id=${id} ${userIdFilter} LIMIT 1;`
        console.log(activitySQL)
        return (await db.query(activitySQL))[0]
    }

    async update(id, type, description, duration, datetime, place){
        const activitySQL = `UPDATE activities SET 
            type='${type}',
            description='${description}',
            duration='${duration}',
            date='${datetime}',
            place='${place}'
            WHERE id=${id};`


        console.log(activitySQL)
        return (await db.query(activitySQL))[0]
    }
}

module.exports = Activity