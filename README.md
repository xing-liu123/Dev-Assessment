## Introduction

Hello, thank you for showing your interest in Bits of Good! This semester, we are focusing our recruitment on the practical skills of developers through this backend-focused assessment! We hope you enjoy the task and feel free to reach out to our email (hello@bitsofgood.org) if you have any questions!

While this assessment comes in various levels (Setup --> Expert), we do not expect you to be able to complete all of the levels; we just want to see your thought process and how you write and organize code. Additionally, we have provided a sample Express.js boilerplate but feel free to use a different framework or customize this repository to your needs (i.e. install any extra libraries, etc. you need). Our only requirement is that you use Javascript/Typescript with a NoSQL database (i.e. Firestore, MongoDB, etc.).

## Context

For this take home assessment, we are building an animal training management app! Our job for the app, is to build out backend functionality to manage different users, animals, and training logs. Schemas for these data models can be found in Schemas.md

## Level 0: Setup

- Setup a NoSQL database
- Create a GET endpoint at `/api/health` to test whether your API server is functioning and healthy
  - This can return a JSON with `{"healthy": true}`

## Level 1: Easy

- Create a POST endpoint at `/api/user` to create a user in the database based on information passed into the body

  - Body: A JSON containing the user information for the user we want to create
  - Response:
    - **Status 200 (Success):** If the body contains all of the information and is able to create the user
    - **Status 400:** If the body contains incorrect information
    - **Status 500:** For any other errors that occur

- Create a POST endpoint at `/api/animal` to create an animal in the database based on information passed into the body

  - Body: A JSON containing the animal information for the animal we want to create
  - Response:
    - **Status 200 (Success):** If the body contains all of the information and is able to create the animal
    - **Status 400:** If the body contains incorrect information
    - **Status 500:** For any other errors that occur

- Create a POST endpoint at `/api/training` to create a training log in the database based on information passed into the body
  - Body: A JSON containing the training log information for the training log we want to create
  - Response:
    - **Status 200 (Success):** If the body contains all of the information and is able to create the training log
    - **Status 400:** If the body contains incorrect information
    - **Status 500:** For any other errors that occur

## Level 2: Medium

## Level 3: Hard

## Level 4: Expert
