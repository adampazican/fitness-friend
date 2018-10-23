const bcrypt = require('bcrypt')
const db = require('../db')

const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR

class User{
    async create(username, password) {
        if(await this.isUsernameTaken(username)) throw 'Username is already taken!'
        const salt = await bcrypt.genSalt(parseInt(SALT_WORK_FACTOR))
        const hashedPass = await bcrypt.hash(password, salt)

        const userSQL = `INSERT INTO users (username, password) VALUES
            ('${username}','${hashedPass}');`

        await db.query(userSQL)
    }

    async isUsernameTaken(username){
        try{
            const usernameTaken = await this.getByUserName(username)
            return usernameTaken.length > 0
        }
        catch(err){
            return false
        }
    }

    async getByUserName(username){
        const userSQL = `SELECT * FROM users WHERE username='${username}';`
        return await db.query(userSQL)
    }

    async getById(id){
        const userSQL = `SELECT * FROM users WHERE id='${id}';`
        return await db.query(userSQL)
    }

    async authenticate(pass, hashedPass){
        return bcrypt.compare(pass, hashedPass)
    }
}


module.exports = User