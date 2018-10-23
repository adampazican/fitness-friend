const mysql = require('promise-mysql')

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

connection.query('SELECT 1 FROM users LIMIT 1;')
    .catch(err => setup())

function setup(){
    const usersTable = `CREATE TABLE users(
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY(ID)
    );`
    
    connection.query(usersTable)

    const activitiesTable = `CREATE TABLE activities(
        id INT NOT NULL AUTO_INCREMENT,
        type VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        duration VARCHAR(255) NOT NULL,
        date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        place VARCHAR(255),
        userId INT NOT NULL,
        PRIMARY KEY(ID)
    );`

    connection.query(activitiesTable)
}

module.exports = connection
