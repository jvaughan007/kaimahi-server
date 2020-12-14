const supertest = require('supertest');
const app = require('../src/app');
const { mockAccountFixture } = require('./fixtures/account.fixtures');
const knex = require('knex');

describe('App', () => {
    // holds database instance throughout this test suite
    let db;
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
        db.raw('TRUNCATE leads, accounts RESTART IDENTITY CASCADE;');
        db.destroy();
    });
    // clear db after every test case
    afterEach('Clear the table', () => db.raw('TRUNCATE leads, accounts RESTART IDENTITY CASCADE;'));

    it('GET / responds with 200 containing "Hello, world!"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Hello, world!');
    });

    it('POST /login responds with 200 and user information', async () => {
        await db.into('accounts').insert(testAccounts)
        return supertest(app)
            .post('/login')
            .send({ email: testAccounts[0].email, password: testAccounts[0].password  })
            .expect(200)
    });

    it('POST /signup reponds with a 200 ok', async () => {
        const newAccount = [{email: 'testNew@email.com', password: 'test', name: 'testNewAccount'}]
        await db.into('accounts').insert()
        return supertest(app)
        .post('/signup')
        .send({email: newAccount[0].email, password: newAccount[0].password, name: newAccount[0].name})
        .expect(200)
    })

    it('POST /signout responds with a 204 status', async () => {
        return supertest(app)
        .post('/signout')
        .expect(204)
    })

});