const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const LeadsService = require('./leads-service');

const leadsRouter = express.Router();
const bodyParser = express.json();

const serializeLead = lead => ({
    id: lead.id,
    name: xss(lead.name),
    email: xss(lead.email),
    phone: xss(lead.phone),
    lastContacted: lead.last_contacted,  
    accountId: lead.account_id, 
});

leadsRouter
    .route('/')
    .get((req, res, next) => {
        LeadsService.getAllLeads(req.app.get('db'))
            .then(leads => {
                console.log(leads);
                res.json(leads.map(serializeLead));
            })
            .catch(next);
    })
    .post(bodyParser, (req, res, next) => {
        for (const field of ['name', 'email', 'phone', 'last_contacted', 'account_id']) {
            if (!req.body[field]) {
                logger.error(`${field} is required`);
                return res.status(400).send(`'${field}' is required`);
            }
        }
        const newLead = req.body;
        LeadsService.insertLead(
            req.app.get('db'),
            newLead
        )
            .then(lead => {
                console.log(lead);
                logger.info(`Lead with id ${lead.id} created`);
                res
                    .status(201)
                    .location(`/leads/${lead.id}`)
                    .json(serializeLead(lead));
            })
            .catch(next);
    });

leadsRouter
    .route('/:lead_id')
    .all((req, res, next) => {
        console.log('requesting all specific lead info...');
        const { lead_id } = req.params;
        LeadsService.getById(req.app.get('db'), lead_id)
            .then(lead => {
                if (!lead) {
                    logger.error(`Lead with id ${lead_id} not found`);
                    return res.status(404).json({
                        error: { message: 'Note not found' }
                    });
                }
                res.lead = lead;
                next();
            })
            .catch(next);
    })
    .get((req, res) => {
        res.json(serializeLead(res.lead));
    })
    .patch((req, res, next) => {
        const { lead_id } = req.params;
        console.log(req.body);
        LeadsService.updateLead(req.app.get('db'), lead_id, req.body).then((resp) => {
            logger.info(`Lead with id ${lead_id} updated.`);
            res.json(serializeLead(resp));
        }).catch(next);
    })
    .delete((req, res, next) => {
        const { lead_id } = req.params;
        LeadsService.deleteLead(
            req.app.get('db'),
            lead_id
        )
            .then(numRowsAffected => {
                logger.info(`Lead with id ${lead_id} deleted.`);
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = leadsRouter;
    
    

    
