const SQL = require('sql-template-strings');
const { getDatabase } = require('../db/database.js');

async function getNumberOfLikesFromArticle(articleId) {
    const db = await getDatabase();

    const likeDetail = await db.all(SQL `
    select *
    from likes
    where article_id = ${articleId}
    `)
    const likeCounts = likeDetail.length;
    return likeCounts;
}


async function checkIfLiked(userid, articleId) {
    const db = await getDatabase();
    const res = await db.get(SQL`
        select exists (
            select * from likes
            where article_id = ${articleId}
            and user_id = ${userid}
        ) as output
    `)
    return res?.output === 1;
}

async function removeLike(userid, articleId) {
    const db = await getDatabase();
    await db.all(SQL`
        delete
        from likes
        where user_id = ${userid}
            and article_id = ${articleId}
    `)
}

async function addLike(userid, articleId) {
    const db = await getDatabase();
    await db.all(SQL`
        INSERT INTO likes (user_id, article_id)
        VALUES (${userid}, ${articleId})
    `)
}

module.exports = {
    getNumberOfLikesFromArticle,
    checkIfLiked,
    removeLike,
    addLike
}