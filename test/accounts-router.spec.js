require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const { mockAccountFixture } = require('./fixtures/account.fixtures');
const { expect } = require('chai');
const supertest = require('supertest');

describe('Accounts endpoints', () => {
    // holds database instance throughout this test suite
    let db;
    // the person you're logging in as in this test case
    let currentUser;
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



    it('GET /api/v1/accounts/ returns a 200', async () => {
        await db
        return supertest(app)
        .get('/api/v1/accounts')
        .set('authorization', currentUser.accessToken)
        .expect(200, testAccounts)
        // .expect(testAccounts)
    });

    it('GET /api/v1/accounts/:account_id returns a 200', async () => {
        await db
        return supertest(app)
        .get('/api/v1/accounts/1')
        .set('authorization', currentUser.accessToken)
        .expect(200)
    })
});
