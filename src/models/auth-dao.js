// Authentication queries with the database
const SQL = require('sql-template-strings');
const { getDatabase } = require('../db/database.js');

const userDb = require('./generic-dao.js');
const bcrypt = require('bcrypt');


async function getUserWithCredentials(username, password) {
    const matchedUser = await userDb.getUserDataByUsername(username);
    if (matchedUser) {
        if (await verifyHashed(password, matchedUser.password))
            return matchedUser;
    } else return null; // auth failed
}

async function getUserWithAuthToken(auth_token) {
    const db = await getDatabase();
    const userData = await db.get(SQL`
    select * from user
    where auth_token = ${auth_token}`);
    return userData;
}

async function setUserDbAuthToken(username, auth_token) {
    const db = await getDatabase();
    const matchedUser = await userDb.getUserDataByUsername(username);
    return await db.run(SQL`
        update user
        set auth_token = ${auth_token}
        where username = ${matchedUser.username}`);
}

async function createNewUser(fname, lname, username, email, password, DOB, description, icon_path) {
    const db = await getDatabase();
    return await db.run(SQL`
    insert into user (fname, lname, username, email, password, DOB, description, admin, icon_path)
    values (${fname}, ${lname}, ${username}, ${email}, ${password}, ${DOB}, ${description}, 0, ${icon_path})`);
}

async function verifyHashed(original, dbData) {
    try {
        if ((await bcrypt.compare(original, dbData)) || original === dbData)
            return true;
        return false;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getUserWithCredentials,
    getUserWithAuthToken,
    setUserDbAuthToken,
    createNewUser,
    verifyHashed,
};
