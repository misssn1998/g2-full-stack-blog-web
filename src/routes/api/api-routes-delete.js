const express = require('express');
const router = express.Router();

const articlesDao = require('../../models/articles-dao');

router.get("/api/delete-article", async (req,res)=>{
    const articleId = req.query.articleId
    console.log(articleId)
    articlesDao.deleteArticle(articleId)

    res.sendStatus(204)
})

module.exports = router;