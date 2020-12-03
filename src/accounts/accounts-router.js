const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const AccountsService = require('./accounts-service');

const accountsRouter = express.Router();

const serializeLead = lead => ({
    id: lead.id,
    name: xss(lead.name),
    email: xss(lead.email),
    phone: xss(lead.phone),
    lastContacted: lead.last_contacted,  
    accountId: lead.account_id, 
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

    
module.exports = accountsRouter;
    