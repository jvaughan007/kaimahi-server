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
    let db;

    // allows for you to contact mock databases
    before('Make instance of knex', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });
    after('Cut connection to db', () => db.destroy());

    //here we delete everything(clean the table) so as it wont interfere with the test upcoming
    before('Clear the table', () => db.raw(
        'TRUNCATE leads, accounts RESTART IDENTITY CASCADE;'
    )
    );

    afterEach('Clear the table', () => db.raw(
        'TRUNCATE leads, accounts RESTART IDENTITY CASCADE;'
    )
    );

    describe('All leads, /api/v1/leads', () => {
        context('Given there are no leads', () => {
            const testAccounts = mockAccountFixture();
            before('Insert users in to the database', () => 
                db.into('accounts').insert(testAccounts)
            );

            it('Get returns an empty array', () => {
                return supertest(app).get('/api/v1/leads').expect(200, []);
            });
        });

        context('Assuming we DO have leads', () => {
            const testAccounts = mockAccountFixture();
            const testLeads = mockDataInsertion();
            const testJsonLeads = mockData();

            before('Insert users in to the database', () => 
                db.into('accounts').insert(testAccounts).then(()=> db.into('leads').insert(testLeads))
            );
            it('Get returns a leads array', () => {
                return supertest(app).get('/api/v1/leads').expect(200, testJsonLeads);
            });
        });
    });

    describe('POST for leads router', () => {
        const testAccounts = mockAccountFixture();
        const testLeads = mockDataInsertion();

        before('Insert users in to the database', () => 
            db.into('accounts').insert(testAccounts).then(()=> db.into('leads').insert(testLeads))
        );
        context('Given a valid lead,', () => {
            const newLead = {
                name: 'L',
                email: 'l@obito.com',
                phone: '8675309333',
                last_contacted: '2020-12-03T06:00:00.000Z',
                account_id: 1
            };
            it('Get returns a leads array', () => {
                return supertest(app)
                    .post('/api/v1/leads')
                    .send(newLead)
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
        });
        describe('Patch, /:lead_id', () => {
            const testAccounts = mockAccountFixture();
            const testLeads = mockDataInsertion();

            before('Insert users in to the database', () => 
                db.into('accounts').insert(testAccounts).then(()=> db.into('leads').insert(testLeads))
            );
            context('Given a valid lead and updated lead, ', () => {
                const newLead = {
                    name: 'L',
                    email: 'l@obito.com',
                    phone: '8675309333',
                    last_contacted: '2020-12-03T06:00:00.000Z',
                };
                it('Get returns a patched object', () => {
                    return supertest(app)
                        .patch('/api/v1/leads/2')
                        .send(newLead)
                        .expect(200);
                        
                
                        
                });
            });

        });
        describe('DELETE, api/v1/leads', () => {
            const testAccounts = mockAccountFixture();
            const testLeads = mockDataInsertion();

            before('Insert users in to the database', () => 
                db.into('accounts').insert(testAccounts).then(()=> db.into('leads').insert(testLeads))
            );

            context('Given a valid lead, ', () => {
                it('responds with a 204', () => {
                    return supertest(app)
                        .delete('/api/v1/leads/2')
                        .expect(204);
                });
            });
        });
    });});
