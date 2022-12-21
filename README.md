## Introduction

Hello, thank you for showing your interest in Bits of Good! This semester, we are focusing our recruitment on the practical skills of developers through this backend-focused assessment! We hope you enjoy the task and feel free to reach out to our email (hello@bitsofgood.org) if you have any questions!

While this assessment comes in various levels (Setup --> Expert), we do not expect you to be able to complete all of the levels; we just want to see your thought process and how you write and organize code. Additionally, we have provided a sample Express.js boilerplate but feel free to use a different framework or customize this repository to your needs (i.e. install any extra libraries, etc. you need). Our only requirement is that you use Javascript/Typescript with a NoSQL database (i.e. Firestore, MongoDB, etc.).

Because this assessment is very open ended, there are many ways to do the tasks so for most of the tasks, there is no right or wrong way to do things.

## Context

For this take home assessment, we are building an animal training management app! Our job for the app, is to build out backend functionality to manage different users, animals, and training logs. Schemas for these data models can be found in `Schemas.md`

## Getting Started

If you would like to use our boilerplate, you can easily get started by:

- Install Node.js (we reccommend v16+ but should work with older versions too)
- Clone the repository: `git clone https://github.com/GTBitsOfGood/spring23-dev-assessment.git`
- Install the Dependencies: `npm install`
- Start the Http server: `npm run start`
- Navigate to `localhost:5000/`

## Level 0: Setup

- Setup a NoSQL database
- Create a GET endpoint at `/api/health` to test whether your API server is functioning and healthy
  - This can return a JSON with `{"healthy": true}`

## Level 1: Easy

- (1) Create a POST endpoint at `/api/user` to create a user in the database based on information passed into the body
- (2) Create a POST endpoint at `/api/animal` to create an animal in the database based on information passed into the body
- (3) Create a POST endpoint at `/api/training` to create a training log in the database based on information passed into the body

- Note these requests will have a similar request body and response statuses:
  - Body: A JSON containing the training log information for the user/animal/training log we want to create
  - Response:
    - **Status 200 (Success):** If the body contains all of the information and is able to create the user/animal/training log
    - **Status 400:** If the body contains incorrect information
    - **Status 500:** For any other errors that occur

## Level 2: Medium

- (4) In the training log creation endpoint (3), we want to add in a check to ensure that the animal specified in the training log belongs to the user specified in the training log. Add in code to do this.
  - Response:
    - **Status 400:** If the training log animal is not owned by specified user

## Level 3: Hard

- We want to add user authentication. In the user creation endpoint (1), add code that allows a password to be accepted. Encrypt this password using an encryption library (we reccommend using [bcrypt](https://www.npmjs.com/package/bcrypt)) and save it in the database under the user's password field
- Create a POST endpoint at `/api/login` that accepts an email and password and tests whether the password is valid for the given email.
  - Response:
    - **Status 200 (Success):** If the email/password combo is valid
    - **Status 403**: If the email password combo is invalid

## Level 4: Expert

- We are going to make our application even more secure by adding JSON Web Token (JWT) functionality to secure our endpoints. Create a POST endpoint at `/api/verify` that issues a JSON Web Token to the user if they issue the correct email/password combination.
  - Response:
    - **Status 200 (Success):** If the email/password combo is valid + issue a JWT that includes the entirety of their profile information
    - **Status 403**: If the email password combo is invalid
- In each of our endpoints, verify the JWT and only allow execution of the endpoint if the JWT is not expired and is valid
- Because the JWT includes information about the user making the request, refactor your endpoints to draw information from the JWT rather than the body of the request
  - I.e. we no longer need to manually specifiy a user id when creating a service animal beacuse we can pull from the info encoded into the JWT.
