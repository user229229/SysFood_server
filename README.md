# Express-Mongoose-Passport Boilerplate

## Overview
This is a boilerplate for a backend API authenticated with JWT. It features:
* An Express.js server
* Mongoose connected to a MongoDB database.
* Passport with a JWT strategy.

## Set up:
All the project needs to run successfully is a **_.env_** file with the variables **DB_URL** and **SECRET**. It should look like this: <br>
```bash
DB_URL=... # URL to your MongoDB database
SECRET=... # Secret key to encrypt JWT tokens
```
Once you have created your **_.env_** file, you can start the app in dev mode with the command:
```bash
npm run dev
```

## Registering users, Login In, and Accessing Protected Routes.
Check out [this documentation](https://documenter.getpostman.com/view/6434796/SVYkvfzP?version=latest) for a guide on how to register new users, authenticate them, and access secure routes within this boilerplate.