const SQL = require('sql-template-strings');
const { getDatabase } = require('../db/database.js');

const genericDao = require('../models/generic-dao.js');
const articleDao = require('../models/articles-dao.js');

async function storeNotificationToUser(
    sender,
    receiver,
    timestamp,
    content,
    articleId,
    type,
    isRead,
    isViewed
) {
    if (sender != receiver) {
        const db = await getDatabase();
        await db.all(SQL`
  insert into notifications (host_id, receiver_id, time, content, article_id, type, isRead, isViewed)
  values (${sender}, ${receiver}, ${timestamp}, ${content}, ${articleId}, ${type}, ${isRead}, ${isViewed})
`);
    }
}

async function getAllNotificationsById(userId) {
    const db = await getDatabase();
    const notifications = await db.all(SQL`
    select *
    from notifications
    where notifications.receiver_id = ${userId}
    order by time desc;
`);
    return notifications;
}

async function updateIsRead(id) {
    const db = await getDatabase();
    await db.all(SQL`
    update notifications
    set isRead = 1
    where id = ${id};
`);
}

async function updateIsViewed(id) {
    const db = await getDatabase();
    await db.all(SQL`
    update notifications
    set isViewed = 1
    where id = ${id};
`);
}

async function deleteNotification(id) {
    const db = await getDatabase();
    await db.all(SQL`
    delete from notifications
    WHERE id = ${id};
`);
}

async function createNotification(receiverId, senderId, articleId, type) {
    const now = new Date();
    const utcString = now.toISOString();
    const existingLikeOrSubNotif = await returnNotificationIfExists(
        senderId,
        receiverId,
        type
    );
    if (existingLikeOrSubNotif) {
        updateNotifTimeAndStatus(existingLikeOrSubNotif.id, utcString);
    } else {
        const sender = await genericDao.getUserDataById(senderId);
        const contentAction = await createContent(type, articleId);
        const notification = {
            senderId: senderId,
            receiverId: receiverId,
            timestamp: utcString,
            content: `${sender.username} ${contentAction}`,
            articleId: articleId,
            type: type,
            isRead: 0,
            isViewed: 0,
        };
        return notification;
    }

    async function returnNotificationIfExists(sender_id, receiver_id, type) {
        if (type === 'sub' || type === 'like') {
            const db = await getDatabase();
            const notif_id = await db.get(SQL`
        select id
        from notifications
        where host_id = ${sender_id} and receiver_id = ${receiver_id} and type = ${type}
    `);
            return notif_id;
        }
        return null;
    }

    async function updateNotifTimeAndStatus(id, time) {
        const db = await getDatabase();
        await db.get(SQL`
        update notifications
        set time = ${time}, isRead = 0, isViewed = 0
        where id = ${id}
    `);
    }
}

async function createContent(type, articleId) {
    const article = await articleDao.getArticleTitleById(articleId);
    console.log('articleOBJ: ' + article);
    if (type === 'sub') {
        return `subscribed to you!`;
    } else if (type === 'write') {
        return `published a new article: "${article[0].title}"!`;
    } else if (type === 'comment') {
        return `commented on your article: "${article[0].title}"!`;
    } else if (type === 'reply') {
        return `replied to your comment on article: "${article[0].title}"!`;
    } else if (type === 'like') {
        return `liked your article: "${article[0].title}"!`;
    }
}

module.exports = {
    storeNotificationToUser,
    getAllNotificationsById,
    updateIsRead,
    updateIsViewed,
    deleteNotification,
    createNotification,
};
