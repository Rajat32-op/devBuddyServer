const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { registerUser } = require('../services/register')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

async function verifyGoogleToken(req, res) {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    if (!ticket) {
        res.json({ error: "Not Authorized" })
        return;
    }

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ email });

    if (!user) {
        registerUser(name,email)
        user = {
            name: name,
            email: email
        }
    }
    res.cookie("email", email, {
        httpOnly: true,
        secure: false,//set true when deploying
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000
    })
    res.json({ message: "Login successful" })
}

async function checkAlreadyExists(req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        res.json({ error: "Already registered email" });
    }
    else {
        next();
    }
}

async function checkPassword(req, res, next) {
    const user = await User.findOne({ username: req.body.username });
    console.log(user)
    if (!user) {
        res.json({ error: "Not a registered user" });
        return;
    }
    const passwordMatching = await bcrypt.compare(req.body.password, user.password);
    if (passwordMatching) {
        req.user = user;
        next();
    }
    else {
        res.json({ error: "Wrong password" });
    }
}

function generateToken(req, res) {
    const user = {
        username: req.body.username
    }
    const token = jwt.sign(user, process.env.AUTH_SECRET_KEY)
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, //set true when deploying
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Login successful" });
}

async function checkLoggedinUser(req, res, next) {
    const cookieToken = req.cookies.token;
    if (!cookieToken) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const username = jwt.verify(cookieToken, process.env.AUTH_SECRET_KEY).username;
        req.user = await User.findOne( { username: username }).select('-password -__v');
        if (!req.user) {
            res.json({ error: "Not a user" });
            return;
        }
        
        next();
    }
    catch (err) {
        res.json({ error: "Not a user" });
        return;
    }
}
module.exports = {
    checkLoggedinUser, generateToken, checkPassword, checkAlreadyExists, verifyGoogleToken
}