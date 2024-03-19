const express = require('express');
const router = express.Router();

const articleDao = require('../models/articles-dao.js');
const genericDao = require('../models/generic-dao.js');
const subDao = require('../models/sub-dao.js');
const analyticsDao = require('../models/analytics-dao.js')

const { verifyAuthenticated } = require('../middleware/auth-middleware/login-auth.js');
const { getUserArticles, getAllCommentsByArticles, getUserNameByComment } = require('../models/generic-dao.js');

router.get('/', async function (req, res) {

    try {

    res.locals.top5Articles = await articleDao.getTopFiveArticles();
    const articleData = await articleDao.getAllArticles();
    res.locals.articleData = articleData;

    res.render('articlesHome');
    } catch (e) {
        res.locals.errorMessage = 'Page loading incomplete. ' + e
    }
});

router.get('/sub', verifyAuthenticated, async function (req, res) {
    const user_id = res.locals.user.id;
    if (user_id) {
        res.locals.subscriptionList = await subDao.getSubscriptionsByUserID(user_id);
        res.locals.subscriberList = await subDao.getSubscribersByUserID(user_id);
        res.render('subscription&subscriber');
    } else {
        res.redirect('/login');
    }
})

router.get('/profile', async function (req, res) {
    const id = req.query.id;
    // console.log(res.locals.user.id)

    if (id) {
        const profileData = await genericDao.getUserDataById(id);
        console.log(profileData);

        res.locals.profile_user = profileData;

        res.locals.profile_id = id;
        res.locals.profile_subscribers = await subDao.getSubscribersByUserID(profileData.id);
        res.locals.profile_articles = await articleDao.getArticlesByUserID(profileData.id);
        
        res.render('profile');
    } else {
        res.redirect('/');
    }

})

router.get('/my_profile', verifyAuthenticated, async function (req, res) {
    const id = res.locals.user.id;

    const userData = await genericDao.getUserDataById(id);
    if (!userData) {
        res.redirect("/");
    }
    res.locals.userData = userData;

    res.render('myProfile');
})

router.get('/my-page', async function (req, res) {
    const user_id = res.locals.user.id
    console.log(user_id)

    if (user_id) {
        const profileData = await genericDao.getUserDataById(user_id);

        console.log(profileData)

        res.locals.profile_user = profileData;

        // res.locals.profile_icon = profileData.icon_path;
        // res.locals.profile_name = `${profileData.fname} ${profileData.lname}`;
        // res.locals.profile_DOB = profileData.DOB;

        const subscriberList = await subDao.getSubscribersByUserID(profileData.id);
        //console.log(subscriberList)

        res.locals.profile_subscribers = subscriberList;


        const articles = await articleDao.getArticlesByUserID(user_id);
        //console.log(articles)

        res.locals.profile_articles = articles;

        res.render('profile');
    } else {
        res.status(404).send("Page not found 404!");
    }
})

router.get('/my_post', verifyAuthenticated, async function (_, res) {
    try {
        const user = res.locals.user;
        const data = await getUserArticles(user.id)
        const totalPosts = data.length;
        res.locals.posts = data;
        res.locals.total_posts = totalPosts;
        res.render('myPost');
    } catch (e) {
        res.locals.errorMessage = 'Page loading incomplete. ' + e;
        res.render('myPost');
    }
})

router.get("/removeSubscription", verifyAuthenticated, async function (req, res) {
    const subscription_id = req.query.id;
    const user_id = res.locals.user.id;
    if (user_id) {
        try {
            await subDao.removeSpecificSubscriptionByID(user_id, subscription_id);
            res.status(200).json({ message: 'Subscription removed successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error removing subscription' });
        }
    } else {
        res.status(403).json({ message: 'Unauthorized' });
    }
})

router.get('/analytics', async function (req, res) {

    try {
        const user = res.locals.user
        const userId = user["id"]
        const response = await analyticsDao.getNumFollowers(userId)
        const response1 = await genericDao.getUserDataById(userId)
        const comments = await analyticsDao.getNumberOfCommentsPerArticle(userId)
        const likes = await analyticsDao.getArticleLikesPerArticle(userId)
        const top3Articles = await analyticsDao.getMostPopularArticles(userId)
        console.log("skeetskeet")
        console.log(comments)

        // const yuh = await response.json()
        const followerNumber = response[0]["counts"]
        res.locals.followers = followerNumber
        res.locals.user = response1
        res.locals.comments = comments
        res.locals.likes = likes
        res.locals.topArticles = top3Articles
        res.render("analyticsDashboard")
    } catch (e) {
        res.locals.errorMessage = 'Page loading incomplete. ' + e;
        res.render('analyticsDashboard');
    }
});

module.exports = router;