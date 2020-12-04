require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const { mockAccountFixture } = require('./fixtures/account.fixtures');
const { mockDataInsertion } = require('./fixtures/leads.fixtures');
const { mockData } = require('./fixtures/leads.json');
const { expect } = require('chai');
const supertest = require('supertest');
const LeadsService = require('../src/leads/leads-router');




describe('Leads endpoints', () => {
    //define test specs here
    
});

