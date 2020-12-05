require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const { mockAccountFixture } = require('./fixtures/account.fixtures');
const { mockDataInsertion } = require('./fixtures/leads.fixtures');
const { mockData } = require('./fixtures/leads.json');
const { expect } = require('chai');
const supertest = require('supertest');

describe('Leads endpoints', () => {
    // holds database instance throughout this test suite
    let db;
    // the person you're logging in as in this test case
    let currentUser;
    const testLeads = mockDataInsertion();
    const testAccounts = mockAccountFixture();
    // create initial connection with database & store connection in app.
    before('Make instance of knex', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });
    // after all test cases are finished
    // clear db & destory connection
    after('Cut connection to db', () => {
        db.raw('TRUNCATE leads, accounts RESTART IDENTITY CASCADE;')
        db.destroy();
    });
    // Before each test case runs
    // login & get the accessToken from jwt
    beforeEach((done) => {
        db.into('accounts').insert(testAccounts).then(() => {
            supertest(app)
                .post('/login')
                .send({ email: testAccounts[0].email, password: testAccounts[0].password  })
                .end((err, res) => {
                    currentUser = res.body;
                    done();
                });
        });
    });
    // clear db after every test case
    afterEach('Clear the table', () => db.raw('TRUNCATE leads, accounts RESTART IDENTITY CASCADE;'));

    it('Kick out from accessing private route if token is not passed', () => {
        return supertest(app)
            .get('/api/v1/leads')
            .expect(200, { message: 'Token is missing' });
    });

    it('Get leads from /api/v1/leads responds with empty array if there are no leads', () => {
        return supertest(app)
            .get('/api/v1/leads')
            .set('authorization', currentUser.accessToken)
            .expect(200, []);
    });

    it('Get all leads from /api/v1/leads', async () => {
        await db.into('leads').insert(testLeads)
        const testJsonLeads = mockData();
        return supertest(app)
            .get('/api/v1/leads')
            .set('authorization', currentUser.accessToken)
            .expect(200, testJsonLeads);
    });

    it('POSTs data into /api/v1/leads and responds with 200 OK', () => {
        const newLead = {
            name: 'L',
            email: 'l@obito.com',
            phone: '8675309333',
            last_contacted: '2020-12-03T06:00:00.000Z',
            account_id: 1
        };
        return supertest(app)
            .post('/api/v1/leads')
            .send(newLead)
            .set('authorization', currentUser.accessToken)
            .expect(201)
            .expect(res => {
                expect(res.body.name).to.eql(newLead.name);
                expect(res.body.email).to.eql(newLead.email);
                expect(res.body.phone).to.eql(newLead.phone);
                expect(res.body.lastContacted).to.eql(newLead.last_contacted);
                expect(res.body.accountId).to.eql(newLead.account_id);
                expect(res.body).to.have.property('id');
                expect(res.headers.location).to.eql(`/leads/${res.body.id}`);
            });
    });

    it('On POSTing invalid data into /api/v1/leads responds with 400 & rejects the request', () => {
        const newLead = {
            name: 'L',
            last_contacted: '2020-12-03T06:00:00.000Z',
            account_id: 1
        };
        return supertest(app)
            .post('/api/v1/leads')
            .send(newLead)
            .set('authorization', currentUser.accessToken)
            .expect(400)
            .expect("'email' is required");
    });

    it('On PATCHing /api/v1/leads/:lead_id respond with 200', async () => {
        await db.into('leads').insert(testLeads)
        const editLead = {
            name: 'L',
            email: 'l@obito.com',
            phone: '8675309333',
            last_contacted: '2020-12-03T06:00:00.000Z',
        };
        return supertest(app)
            .patch('/api/v1/leads/2')
            .send(editLead)
            .set('authorization', currentUser.accessToken)
            .expect(200)
            .expect(res => {
                expect(res.body.name).to.eql(editLead.name);
                expect(res.body.email).to.eql(editLead.email);
                expect(res.body.phone).to.eql(editLead.phone);
                expect(res.body.lastContacted).to.eql(editLead.last_contacted);
                expect(res.body.id).to.eql(2);
            });
    });

    it('responds with a 204', async () => {
        await db.into('leads').insert(testLeads)
        return supertest(app)
            .delete('/api/v1/leads/2')
            .set('authorization', currentUser.accessToken)
            .expect(204);
    });
});
