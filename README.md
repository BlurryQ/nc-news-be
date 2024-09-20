# Northcoders News API

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/).

**Hosted API** [NC News](https://nc-news-lbn1.onrender.com/api)

## Summary

This project showcases RESTful API's designed to manage articles and comments, providing users with the ability to create, read, update, and delete (CRUD) articles and comments.

## Requirements

**Node:** v20.12.2 + <br>
**pSQL:** 14.13 +

## Setup

To get started with this project, follow the steps below:

### 1. For the Repository

First you need to fork this repo to your GitHub account by clicking fork button near the top right of this page. If you are unfamiliar with this then please follow this GitHub [guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo).

### 2. Clone the Repository

The next step is cloning this to your local device using the follwoing command, changing the "your-username" to your GitHub username:

```
git clone github.com/your-username/nc-news-be
```

### 3. Creating your Enviroment

Once forked you will need to add a .env file in the root directory for each enviroment you wish to use.

- For testing you will need a file called ".env.test" with the name of your test database.

- For development a ".env.development" with your development database.

Inside these you will need to link your database by putting the following code inside, replacing "database_name_here" with your database name:

```
PGDATABASE=database_name_here
```

### 4. Install Dependencies

Now this has been done install all the npm dependencies by running the following command in your terminal/ cli:

```
npm install
```

### 5. Set Up the Database

With your environment variables configured and dependencies installed, you can set up the pSQL database and seed them with initial data using the following commands:

```
npm setup-dbs
npm seed
```
