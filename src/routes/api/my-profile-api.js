const express = require('express');
const router = express.Router();

const userDao = require('../../models/user-dao.js');
const login = require(`../../middleware/auth-middleware/login-auth.js`);
const bcrypt = require('bcrypt');

router.post('/api/deleteAccount', async (req, res) => {
    try {
        const user_id = req.body.userKey;
        let done = undefined;
        if (user_id) {
            done = await userDao.deleteUserById(user_id);
            if (!done) {
                throw new Error('Deleting failed');
            }
            console.log(done);
            res.status(200).send('Account Deleted');
        } else {
            throw new Error('User not found');
        }
    } catch (e) {
        res.status(500).send('Deleting Error: ' + e);
    }
});

router.post('/api/updateInfo', async (req, res) => {
    const user_id = res.locals.user.id;
    const info = req.body;
    const fname = info.my_profile_fname;
    const lname = info.my_profile_lname;
    const email = info.my_profile_email;
    const DOB = info.my_profile_DOB;
    const desc = info.my_profile_desc;
    try {
        if (!info.icon) {
            const sqlReponse = await userDao.updateUserProfileWithoutIconUpdate(
                user_id,
                email,
                fname,
                lname,
                DOB,
                desc
            );
            if (sqlReponse) {
                res.status(200).send('Information updated!');
            }
        } else {
            const iconPath = `/images/avatars/${info.icon}.png`;
            const sqlReponse = await userDao.updateUserProfile(
                user_id,
                email,
                fname,
                lname,
                DOB,
                desc,
                iconPath
            );
            if (sqlReponse) {
                res.status(200).send('Information updated!');
            }
        }
    } catch (e) {
        res.status(500).send('Updating Error: ' + e);
    }
});

router.post(
    '/api/updateSecurityInfo',
    login.confirmCurrentPassowrd,
    async (req, res) => {
        const info = req.body;
        const user_id = res.locals.user.id;
        const username = info.my_profile_username;
        const password = info.my_profile_password;

        try {
            bcrypt.hash(password, 12, async (err, passwordHash) => {
                await userDao.updateUserSecurityDetails(
                    user_id,
                    username,
                    passwordHash
                );
            });
            res.status(200).send('Security details updated!');
        } catch (e) {
            res.status(500).send('Updating Error: ' + e);
        }
    }
);

module.exports = router;
