const express = require('express');
const router = express.Router();
const analyticsDao = require(`../../models/analytics-dao`)

router.get('/api/get-analytics', async function (req, res) {
    const user = res.locals.user
    if (user !== undefined) {
        const userId = user["id"]
        const numberOfFollowers = await analyticsDao.getNumFollowers(userId);
        const numberOfComments = await analyticsDao.getNumberOfComments(userId);
        const numberOfLikes = await analyticsDao.getArticleLikes(userId);

        const top3Articles = await analyticsDao.getMostPopularArticles(userId);

        res.locals.followers = numberOfFollowers;
        // res.locals.comments = 
        
        const sendObj = {
            numberOfFollowers,
            numberOfComments,
            numberOfLikes,
            top3Articles
        }
        console.log(sendObj)

        res.json(sendObj)
    }else{
        const sendObj = {
            msg:"user not logged in"
        }
        res.json(sendObj)
    }
});

module.exports = router;