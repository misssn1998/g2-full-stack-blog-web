const SQL = require('sql-template-strings');
const { getDatabase } = require('../db/database.js');

async function getAllCommentsByUserId(userId) {
    const db = await getDatabase();
    const allComments = await db.all(SQL`
    SELECT *
    FROM comments
    WHERE user_id = ${userId};
    `);
    return allComments;
}

async function getAllFirstLevelCommentsByArticleID(articleId) {
    const db = await getDatabase();
    const allFirstLevelComments = await db.all(SQL`
    SELECT comments.*, user.username, user.fname, user.lname, user.icon_path
    FROM comments, user
    WHERE comments.article_id = ${articleId}
    AND user.id = comments.user_id
    AND comments.comments_id IS NULL
    ORDER BY comments.time_of_comment DESC
    `);

    allFirstLevelComments.forEach(comment => {
        const dateTimeUTC = comment.time_of_comment;
        const localTime = new Date(dateTimeUTC).toLocaleString();
        comment.time_of_comment = localTime;
    })

    return allFirstLevelComments;
}

async function getAllSecondOrThirdLevelCommentsByComment_id(
    comment_id,
    article_id
) {
    const db = await getDatabase();
    const allSecondOrThirdComments = await db.all(SQL`
    SELECT comments.*, user.username, user.fname, user.lname, user.icon_path
    FROM comments, user
    WHERE comments.article_id = ${article_id}
    AND user.id = comments.user_id
    AND comments.comments_id = ${comment_id}
    ORDER BY comments.time_of_comment DESC
    `);

    allSecondOrThirdComments.forEach(comment => {
        const dateTimeUTC = comment.time_of_comment;
        const localTime = new Date(dateTimeUTC).toLocaleString();
        comment.time_of_comment = localTime;
    })

    return allSecondOrThirdComments;
}

async function deleteComments(comment_id, article_id) {
    const childComments = await getAllSecondOrThirdLevelCommentsByComment_id(
        comment_id,
        article_id
    );

    let done1 = undefined;
    if (childComments) {
        done1 = childComments.forEach(async (comment) => {
            const comment_id = comment.id;
            const article_id = comment.article_id;

            const grandChildComments =
                await getAllSecondOrThirdLevelCommentsByComment_id(
                    comment_id,
                    article_id
                );

            if (grandChildComments) {
                grandChildComments.forEach(async (comment) => {
                    const comment_id = comment.id;
                    const article_id = comment.article_id;

                    return await deleteThisComment(comment_id, article_id);
                });
            }
            return await deleteThisComment(comment_id, article_id);
        });
    }
    return await deleteThisComment(comment_id, article_id);
}

async function deleteThisComment(comment_id, article_id) {
    const db = await getDatabase();

    return await db.run(SQL`
        DELETE FROM comments 
        WHERE id = ${comment_id}
        AND article_id = ${article_id}`);
}

async function insertNewCommentOnArticle(user_id, article_id, content) {
    const db = await getDatabase();

    const now = new Date();
    const utcString = now.toISOString();

    return await db.run(SQL`
        INSERT INTO comments (user_id, article_id, content, time_of_comment)
        VALUES (${user_id}, ${article_id}, ${content}, ${utcString})`);
}

async function insertNewCommentOnComment(
    user_id,
    article_id,
    content,
    comment_id
) {
    const db = await getDatabase();

    const now = new Date();
    const utcString = now.toISOString();

    return await db.run(SQL`
        INSERT INTO comments (user_id, article_id, content, time_of_comment, comments_id)
        VALUES (${user_id}, ${article_id}, ${content}, ${utcString}, ${comment_id})`);
}

async function getCommentById(comment_id) {
    const db = await getDatabase();

    const comment = await db.get(SQL`
        SELECT comments.*, user.username, user.fname, user.lname 
        FROM comments, user
        WHERE comments.id = ${comment_id}
        AND user.id = comments.user_id`);

    const dateTimeUTC = comment.time_of_comment;
    const localTime = new Date(dateTimeUTC).toLocaleString();
    comment.time_of_comment = localTime;

    return comment;
}

async function getAuthorIdByCommentId(comment_id) {
    const db = await getDatabase();

    return await db.get(SQL`
        SELECT comments.user_id 
        FROM comments
        WHERE comments.id = ${comment_id}
        `);
}

module.exports = {
    getAllFirstLevelCommentsByArticleID,
    getAllSecondOrThirdLevelCommentsByComment_id,
    getAllCommentsByUserId,
    deleteComments,
    insertNewCommentOnArticle,
    insertNewCommentOnComment,
    deleteThisComment,
    getCommentById,
    getAuthorIdByCommentId,
};
