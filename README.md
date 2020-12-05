# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

Documentation
Endpoints
// Authenticated
1. GET /api/v1/leads


2. POST /api/v1/leads

This endpoint can help post new lead. Required fields are 'name', 'email', 'phone', 'last_contacted', 'account_id'. Data format expected expected is application json.
```
{
    name: 'L',
    email: 'l@obito.com',
    phone: '8675309333',
    last_contacted: '2020-12-03T06:00:00.000Z',
    account_id: 1
}
```

3. PATCH /api/v1/leads/:lead_id
4. PATCH /api/v1/leads/:lead_id
5. DELETE /api/v1/leads/:lead_id
// Not auth