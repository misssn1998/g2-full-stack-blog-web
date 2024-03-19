// General queries with the database
const SQL = require('sql-template-strings');
const { getDatabase } = require('../db/database.js');
const { getAllUserData } = require('./generic-dao.js');

async function getNumFollowers(user_id) {
    console.log("skeetskeet")
    const db = await getDatabase()

    const numFollowers = await db.all(SQL`
    select count(being_subscribed_id) as counts from subscription 
    where being_subscribed_id = ${user_id}
    `)
    console.log("skatskat")

    return numFollowers

}

async function getArticleLikes(user_id) {
    const db = await getDatabase();

    const numLikes = await db.all(SQL`
    select title, like_count from [Articles_info]
    where user_id = ${user_id} 
    `)
    let totalLikes = 0;
    for (let i =0; i<numLikes.length;i++){
        totalLikes += numLikes[i]["like_count"]
    }
    return totalLikes;
}

async function getArticleLikesPerArticle(user_id) {
    const db = await getDatabase();

    const numLikes = await db.all(SQL`
    select title, like_count from [Articles_info]
    where user_id = ${user_id} 
    `)
    return numLikes;
}

async function getNumberOfComments(user_id){
    const db = await getDatabase();

    const numOfComments = await db.all(SQL`
    select user_id, article_id, title, comments_count from [Articles_info]
    where user_id = ${user_id}
    `)

    let totalComments = 0;
    for (let i =0; i<numOfComments.length;i++){
        totalComments += numOfComments[i]["comments_count"]
    }
    return totalComments;
}

async function getNumberOfCommentsPerArticle(user_id){
    const db = await getDatabase();

    const numOfComments = await db.all(SQL`
    select user_id, article_id, title, comments_count from [Articles_info]
    where user_id = ${user_id}
    `)
    return numOfComments;
}

async function getMostPopularArticles(user_id){
    const db = await getDatabase();

    const mostPopular =await db.all(SQL`
        select * from [Articles_info]
        where user_id = ${user_id}
        order by popularity desc
        limit 3
    `)

    for(let i =0; i<mostPopular.length; i++){
        mostPopular[i]["index"] = i+1
    }

    return mostPopular;
}

module.exports ={
    getNumFollowers,
    getNumberOfComments,
    getArticleLikes,
    getMostPopularArticles,
    getNumberOfCommentsPerArticle,
    getArticleLikesPerArticle
}