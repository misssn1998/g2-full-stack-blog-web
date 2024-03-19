const authDao = require('../../models/auth-dao');
const userDb = require('../../models/generic-dao');
const bcrypt = require('bcrypt');

async function authenticate(req, res, next) {
    req.username = req.body.username;
    const matchedUser = await userDb.getUserDataByUsername(req.username);
    if (matchedUser) {
        res.setToastMessage('Username taken, please choose another');
        return res.redirect('/register');
    }

    req.password = req.body.password;
    req.confirm_password = req.body.confirm_password;
    if (req.password !== req.confirm_password) {
        res.setToastMessage('Please ensure the passwords match');
        return res.redirect('/register');
    }
    next();
}

async function newUser(req, res, next) {
    req.fname = req.body.fname;
    req.lname = req.body.lname;
    req.email = req.body.email;
    req.dob = req.body.dob;
    req.description = req.body.description;
    const icon = req.body.icon;
    const icon_path = `/images/avatars/${icon}.png`;
    bcrypt.hash(req.password, 12, async (err, passwordHash) => {
        bcrypt.hash(req.username, 1, async (err, usernameHash) => {
            await authDao.createNewUser(
                req.fname,
                req.lname,
                req.username, // can use usernameHash to store hash instead
                req.email,
                passwordHash,
                req.dob,
                req.description,
                icon_path
            );
        });
    });
    next();
}


module.exports = {
    authenticate,
    newUser,
};