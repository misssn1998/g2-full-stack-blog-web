const express = require('express');
const router = express.Router();

const subDao = require('../../models/sub-dao');
const notifyDao = require('../../models/notify-dao');
const userDb = require('../../models/generic-dao');

router.get('/api/getSubscribersByUserId', async function (req, res) {
    const userId = req.query.userId;
    const subscribers = await subDao.getSubscribersByUserID(userId);
    console.log(subscribers);
    if (subscribers) {
        res.status(200).json({ subscribers });
    } else res.status(401).send('no subscribers');
});

router.get('/api/check-username', async function (req, res) {
    const username = req.query.username;
    const matchedUser = await userDb.getUserDataByUsername(username);
    if (matchedUser) {
        res.send('username exists');
    } else res.send('username does not exist');
});

router.get('/api/get-all-notifications', async function (req, res) {
    const user = res.locals.user;
    let notifications;
    if (user) {
        notifications = await notifyDao.getAllNotificationsById(user.id);
    }
    res.status(200).json(notifications);
});

router.get('/api/update-isRead', async function (req, res) {
    const noteId = req.query.id;
    await notifyDao.updateIsRead(noteId);
    res.sendStatus(204);
});

router.get('/api/update-isViewed', async function (req, res) {
    const noteId = req.query.id;
    await notifyDao.updateIsViewed(noteId);
    res.sendStatus(204);
});

router.delete('/api/delete-notification', async function (req, res) {
    const noteId = req.query.id;
    await notifyDao.deleteNotification(noteId);
    res.sendStatus(204);
});

router.get('/api/get-user-by-id', async function (req, res) {
    const userId = req.query.id;
    const response = await userDb.getUserDataById(userId);
    res.status(200).json(response);
});

module.exports = router;
