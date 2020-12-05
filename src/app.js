require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const knex = require('knex');
const AccountsService = require('./accounts/accounts-service');
const AuthHelpers = require('./authentication/helper');
const AccountRouter = require('./accounts/accounts-router');
const leadsRouter = require('./leads/leads-router');

const app = express();
const jsonParser = express.json();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

// Standard Middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
});

app.set('db', db);

// Routes
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// where does this go?
// ***Also, should this be pulling the leads here? If so,
// do we use '.then' or do we just use a get and return?
// Is return used on the front end not the back end? 
// Am I thinking too much in to this and getting the front end and back end tangled?
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(422).json({ message: 'Missing information in request' });
    }
    const userAccount = await AccountsService.checkIfUserExists(app.get('db'), email).then(data => data);
    console.log(userAccount)
    if (!userAccount) {
        res.status(401).json({ message: 'User does not exist in database' });
    } else {
        if (userAccount.password === password) {
            const payload = { email };
            let accessToken = AuthHelpers.createAccessToken(payload);
            let refreshToken = AuthHelpers.createRefreshToken(payload);
            req.session.userInfo = { ...userAccount };
            userAccount.accessToken = accessToken;
            req.session.userInfo.refreshToken = refreshToken;
            res.cookie('authorization', accessToken, {secure: true, httpOnly: true});
            res.json({ ...userAccount });
        } else {
            res.status(401).json({ message: 'Password doesnt match' });
        }
    }
    
});

// where does this go?
// accounts router? should accounts be renamed to signup router?? 
app.post('/signup', (req, res) => {
    const { email, password, name } = req.body;
    AccountsService.checkIfUserExists(app.get('db'), email).then(data => {
        if (!data) {
            const userInfo = { email, password, name };
            AccountsService.createNewAccount(app.get('db'), userInfo).then(data => {
                const payload = { email };
                let accessToken = AuthHelpers.createAccessToken(payload);
                let refreshToken = AuthHelpers.createRefreshToken(payload);
                req.session.userInfo = data;
                req.session.userInfo.refreshToken = refreshToken;
                res.cookie('authorization', accessToken, {secure: true, httpOnly: true});
                res.json(data);
            });
        } else {
            res.send(400).json({ message: 'User exists, try login' });
        }
    });
});

// possible route to handle the leads if not pulled from login goes below
app.post('/signout', (req, res) => {
    delete req.session;
    res.cookie('authorization', null);
    res.status(204).send();
});


// Error handlers
app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { message: 'Internal error' };
    } else {
        response = { error, message: error.message };
    }

    res.status(500).json(response);
});

app.use(AuthHelpers.verifyAuthTokens);

app.use('/api/v1/accounts', AccountRouter)
app.use('/api/v1/leads', leadsRouter)

module.exports = app;