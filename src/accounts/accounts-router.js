const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const AccountsService = require('./accounts-service');

const accountsRouter = express.Router();
const bodyParser = express.json();

const serializeLead = lead => ({
    id: lead.id,
    name: xss(lead.name),
    email: xss(lead.email),
    phone: xss(lead.phone),
    lastContacted: lead.last_contacted,  
    accountId: lead.account_id, 
});

const serializeAccount = account => ({
    id: account.id,
    name: xss(account.name),
    email: xss(account.email),
    password: xss(account.password)
});

accountsRouter
    .route('/:account_id')
    .get((req, res) => {
        AccountsService.fetchLeadsOfCurrentUserAccount(req.app.get('db'), req.params.account_id)
            .then(leads => {
                res.json(leads.map(serializeLead));
            })
            .catch(e => {
                console.log(e);
            });
            
    });

accountsRouter
    .route('/')
    .get((req, res, next) => {
        AccountsService.getAllAccounts(req.app.get('db'))
            .then(accounts => {
                console.log(accounts);
                res.json(accounts.map(serializeAccount));
            })
            .catch(next);
    })
    .post(bodyParser, (req, res, next) => {
        for (const field of ['name', 'email', 'password']) {
            if (!req.body[field]) {
                logger.error(`${field} is required`);
                return res.status(400).send(`'${field}' is required`);
            }
            if (AccountsService.checkIfUserExists(req.app.get('db'), req.body)) {
                logger.error(`Account for ${req.body.email} exists, please log in`);
                return res.status(401).send(`Account for ${req.body.email} exists, please log in`);
            }
        }
        const newAccount = req.body;
        AccountsService.createNewAccount(
            req.app.get('db'),
            newAccount
        )
            .then(account => {
                console.log(account);
                logger.info(`Lead with id ${account.id} created`);
                res
                    .status(201)
                    .location(`/accounts/${account.id}`)
                    .json(serializeLead(account));
            })
            .catch(next);
    });

module.exports = accountsRouter;
    