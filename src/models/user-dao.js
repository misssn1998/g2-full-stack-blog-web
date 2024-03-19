const SQL = require('sql-template-strings');
const { getDatabase } = require('../db/database.js');

async function updateUserProfile(user_id, email, fname, lname, DOB, desc, iconPath) {
    const db = await getDatabase();
    return await db.run(SQL`
    UPDATE user 
    SET email = ${email}, fname = ${fname}, lname = ${lname}, DOB = ${DOB}, description = ${desc}, icon_path = ${iconPath}
    WHERE id = ${user_id}`);
}

async function updateUserProfileWithoutIconUpdate(user_id, email, fname, lname, DOB, desc) {
    const db = await getDatabase();
    return await db.run(SQL`
    UPDATE user 
    SET email = ${email}, fname = ${fname}, lname = ${lname}, DOB = ${DOB}, description = ${desc}
    WHERE id = ${user_id}`);
}

async function deleteUserById(user_id) {
    const db = await getDatabase();

    const dropFromNotification = db.run(SQL`
    DELETE FROM user
    WHERE id = ${user_id}`)

    return dropFromNotification;
}

async function updateUserSecurityDetails(user_id, username, password) {
    const db = await getDatabase();
    return await db.run(SQL`
    UPDATE user 
    SET username = ${username}, password = ${password}
    WHERE id = ${user_id}`);
}

module.exports = {
    updateUserProfile,
    updateUserProfileWithoutIconUpdate,
    deleteUserById,
    updateUserSecurityDetails,
}