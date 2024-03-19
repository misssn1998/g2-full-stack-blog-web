const SQL = require('sql-template-strings');
const { getDatabase } = require('../db/database.js');


async function getSubscriptionsByUserID(userid) {
    const db = await getDatabase();
    const subscription = await db.all(SQL`
        select user.*
        from user left join subscription on user.id = subscription.being_subscribed_id
        where subscription.follower_id = ${userid}
    `)
    return subscription;
}

async function getSubscribersByUserID(userid) {
    const db = await getDatabase();
    const subscriber = await db.all(SQL`
        select user.*
        from user left join subscription on user.id = subscription.follower_id
        where subscription.being_subscribed_id = ${userid}
    `)
    return subscriber;
}

async function removeSpecificSubscriptionByID(userid, subscription_id) {
    const db = await getDatabase();
    await db.all(SQL`
        delete
        from subscription
        where follower_id = ${userid}
              and being_subscribed_id = ${subscription_id}
    `)
}

async function removeSpecificSubscriberByID(userid, subscriber_id) {
    const db = await getDatabase();
    await db.all(SQL`
        delete
        from subscription
        where being_subscribed_id = ${userid}
            and follower_id = ${subscriber_id}
    `)
}

async function addSpecificSubscriptionByID(userid, subscription_id) {
    const db = await getDatabase();
    await db.all(SQL`
        INSERT INTO subscription (being_subscribed_id, follower_id)
        VALUES (${subscription_id}, ${userid})
    `)
}


async function checkIfSubscribe(userid, subscriptionId) {
    const db = await getDatabase();
    const res = await db.get(SQL`
        select exists (
            select * from subscription
            where being_subscribed_id = ${subscriptionId}
            and follower_id = ${userid}
        ) as output
    `)
    return res?.output === 1;
}


module.exports = {
    getSubscriptionsByUserID,
    getSubscribersByUserID,
    removeSpecificSubscriptionByID,
    removeSpecificSubscriberByID,
    checkIfSubscribe,
    addSpecificSubscriptionByID
}