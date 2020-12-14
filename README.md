# Welcome to kaimahi

Kaimahi is a full-stack web application that simplifies your lead management and tracking needs. 

The technologies used for this application were: React, PostgreSql, Express, and Node.

# Why use this application?

This application is a simple, no-frills way to orgnize your sales leads. Utilizing minimalistic UI/UX, kaimahi makes referencing your leads and their contact information secure and simple.

# API Endpoints

## Public

### POST '/signup'
This endpoint allows you to add a new account and ensures there are no repeated accounts associated with the email being used in the signup form the user fills out in the frontend. It also creates an access token key-value for the user that will be refreshed upon login.

## Authenticated

### POST '/login'
This endpoint allows you to login and assigns a 'refresh token' upon login to authorization.

### POST '/signout'
This enpoint signs the user out by deleteing the session and changing the authorization to 'null'.

### GET 'api/v1/accounts/'
This endpoint retrieves all the accounts

### GET 'api/v1/accounts/:account_id'
This endpoint retrieves all of the current leads associated with the account of a given id

### GET 'api/v1/leads/'
This endpoint retrieves all of the leads in the database. Leads are associate to accounts via a key-value pair that is valued automatically on a POST to leads table.

### POST 'api/v1/leads/'
This endpoint adds a new lead to the leads table and adds a leads associated account's id.

### GET 'api/v1/leads/:lead_id'
This endpoint retrieves a lead by its own id.

### PATCH 'api/v1/leads/:lead_id'
This endpoint is used to update lead information

### DELETE 'api/v1/leads/:lead_id'
This endpoint will remove a lead from the database.




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
