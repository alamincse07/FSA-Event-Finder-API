# Local Event Finder API

## Features

A Simple REST API for Local Event management within the following features.

- User Registration & Authentication with email verification
- Find nearby events within your area
- Create Events for various types like
  ['Sports', 'Donation', 'Tour', 'Picnic', 'Party', 'Concert', 'Others']
- Participate in a event
- Decline participation from an event
- Role base access management

## Manual Installation

If you would still prefer to do the installation manually, follow these steps:

Clone the repo:

```bash
git clone --depth 1 https://github.com/hagopj13/node-express-boilerplate.git
cd node-express-boilerplate
npx rimraf ./.git
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000

# URL of the Mongo DB
MONGODB_URL=mongodb://127.0.0.1:27017/node-boilerplate

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

Base Path with version: http://localhost:3000/v1

List of available routes:

**Address**

Address for district, upazilla & union

GET
/address/district

- Get all district list

GET
/address/upazilla

- Get all upazilla list for a given district

GET
/address/union

- Get all unions list for a given upazilla

**Auth**

Authentication setup & retrieval

POST
/auth/register

- Register a user

POST
/auth/send-verification-email

- Send verification email

POST
/auth/verify-email

- Verify email to complete the registration

POST
/auth/login

- Login as a user

POST
/auth/logout

- Logout

POST
/auth/refresh-tokens

- Refresh auth tokens

POST
/auth/forgot-password

- Forgot password

**Events**

Event management & retrieval

POST
/events

- Create an event

GET
/events

- Get all events

GET
/events/{eventId}

- Get a single event

PUT
/events/{eventId}

- Update single event

DELETE
/events/{eventId}

- Delete a single event (Admin)

**Users**

User management and retrieval

GET
/users

- Get all users

GET
/users/{id}

- Get a user

PATCH
/users/{id}

- Update a user

DELETE
/users/{id}

- Delete a user

POST
/users/{id}/change-role

- Change the role of a user

**User Action**

Authenticated User actions like event participate, decline & get own events

POST
/me/participate/{eventId}

- Participate in a event

POST
/me/decline/{eventId}

- Decline participated event

GET
/me/created-events

- Get Events created by the Authenticated user

## ER Diagram

![image info](./assets/relation.png)

## Static resources

- The address data is static and can be imported to the mongo DB database.
- There are theree json files indicating the districts,upazillas & unions inside the `assets` folder.

## TODO

- There are still a lot to do in this API
- Unit testing need to be added
- Need to setup the other endpoint integration testing, currently only the Auth routes are tested with jest
