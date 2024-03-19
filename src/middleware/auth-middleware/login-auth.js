const { v4: uuid } = require('uuid');
const userDb = require('../../models/generic-dao');
const authDao = require('../../models/auth-dao');

async function addUserToLocals(req, res, next) {
    const authToken = req.cookies['authToken'];
    res.locals.user = await authDao.getUserWithAuthToken(authToken);
    // if (!res.locals.user) res.locals.user = await userDb.getUserDataById(1); // THIS IS FOR DEVELOPING PURPOSES ONLY
    next();
}

function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        next();
    } else {
        res.redirect('/');
    }
}

async function authenticate(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const user = await authDao.getUserWithCredentials(username, password);

    if (user) {
        const authToken = uuid();
        await authDao.setUserDbAuthToken(username, authToken); // Save token in the database
        res.cookie('authToken', authToken);
        res.locals.user = user;
        next(); // logged in
    } else {
        res.setToastMessage('Authentication Failed!');
        res.redirect('/login');
    }
}

function authorizeAdmin(req, res, next) {
    const user = res.locals.user; 
    if (user && user.admin === 1) {
        next();
    } else {
        res.status(401).send('Access Denied');
    }
}

async function confirmCurrentPassowrd(req, res, next) {
    const username = res.locals.user.username;
    const currentPassword = req.body.my_profile_currentPassword;
    const user = await authDao.getUserWithCredentials(username, currentPassword);

    if (user) {
        next();
    } else {
        res.status(404).send("Invalid current password");
    }
}

module.exports = {
    verifyAuthenticated,
    addUserToLocals,
    authenticate,
    authorizeAdmin,
    confirmCurrentPassowrd,
};
