// General queries with the database
const SQL = require('sql-template-strings');
const { getDatabase } = require('../db/database.js');

async function getUserDataById(id) {
    const db = await getDatabase();
    const userData = await db.get(SQL`
    select * from user
    where id = ${id}`);
    return userData;
}

async function getUserDataByUsername(username) {
    const db = await getDatabase();
    const userData = await db.get(SQL`
    select * from user
    where username = ${username}`);
    return userData;
}

async function getAllUserData() {
    const db = await getDatabase();
    const allData = await db.all(SQL`select * from user`);
    return allData;
}

async function getUserArticles(userId) {
    const db = await getDatabase();
    const allArticles = await db.all(SQL`
    SELECT articles.id AS article_id, articles.title, articles.content_html, articles.content_delta, articles.image, articles.date_of_publish, user.id AS author_id, user.username AS author_username
    FROM articles
    INNER JOIN user ON articles.author_id = user.id
    WHERE user.id = ${userId}
    `);

    allArticles.forEach(article => {
        const dateTimeUTC = article.date_of_publish;
        const localTime = new Date(dateTimeUTC).toLocaleString();
        article.date_of_publish = localTime;
    })


    return allArticles;
}

async function getAllCommentsByArticles(userId) {
    const db = await getDatabase();
    const allComments = await db.all(SQL`
    SELECT 
    comments.id AS comment_id, comments.content, comments.time_of_comment,
    articles.id AS article_id, articles.title AS article_title,
    user.fname AS commentor_fname,
    user.lname AS commentor_lname,
    user.username AS commentor_username,
    user.icon_path AS commentor_icon_path
    FROM articles
    LEFT JOIN comments ON articles.id = comments.article_id
    LEFT JOIN user ON comments.user_id = user.id
    WHERE articles.author_id = ${userId};
    `);
    return allComments;
}

async function getUserIdByUsername(username) {
    const db = await getDatabase();
    const userId = await db.get(SQL`
      select id from user
      where username = ${username}`);

    return userId;
}

async function getUsernameById(userId) {
    const db = await getDatabase();
    const username = await db.get(SQL`
      select username from user
      where id = ${userId}`);

    return username;
}

async function deleteUserById(userId) {
    const db = await getDatabase();
    await db.get(SQL`
      delete from user
      where id = ${userId}`);
}

function makeArray(input) {
    if (input === undefined) {
        return [];
    } else if (Array.isArray(input)) {
        return input;
    } else {
        return [input];
    }
}

module.exports = {
    getUserDataById,
    getUserDataByUsername,
    getAllUserData,
    getUserArticles,
    getAllCommentsByArticles,
    getUserIdByUsername,
    getUsernameById,
    deleteUserById,
    makeArray,
};
