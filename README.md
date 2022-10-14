# Northcoders News API
This is a RESTFUL API written in Express/Node.JS and will allow the user to interact with the available endpoints listed in the `Available Endpoints` section.

If your browser does not support the viewing of JSON objects, then please consider installing [this extension](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh).

This repostitory uses the current versions of Postgres V14 and Node V18.10.0, and as such it is recommended to use these versions or greater to ensure that this project can be run locally. 

If you'd like to view a live version of this API, please click the link below:

[Live Version](https://clam119-northcoders-news-api.herokuapp.com/api)

## Setup & Installation
If you would like to install the project on your local machine then please clone the repository below:
> ```https://github.com/clam119/Northcoders-News-API.git```

Once you have successfully cloned this repostitory, please proceed by ensuring that you're inside the directory and run the following command to install the dependencies that will be required to run this project:
> ```npm install```

Upon installing the required dependencies, please create the two required environment variable files in the root folder with the following commands:
> ```echo "PGDATABASE = nc_news_test" >> .env.test```

> ```echo "PGDATABASE = nc_news" >> .env.development```

After successfully creating the required environment variables on the root folder. Please run the following commands to create both the test & development databases:
> ```npm run setup-dbs```

> ``` npm run seed```

With this, you will have now complete access to the repostitory. You will be able to navigate below to the available endpoints and test the available endpoints locally using Jest.

## Testing Endpoints With Jest & Localhost
This project has been created with the core Agile practice of TDD (Test-Driven-Development) using the popular Jest Testing framework to ensure that the API works as it is intended to.

Please enter the following command to view the tests that have been created in mind for this project, and feel free to both test & add/remove tests incrementally on your own local copy of this repository:
> ```npm test```

Lastly, if you would like to access the API on your localhost upon successfully setting up this API, please run this following command and navigate to the endpoints available below:
> ```npm run start```
## Available Endpoints
* [x] [GET /api/](localhost:9090/api) - This will serve up a JSON representation of all the available endpoints of the API.
* [x] [GET /api/topics](localhost:9090/api/topics) - This will return an array of all topics that are currently available.
* [x] [GET /api/articles](localhost:9090/api/articles) - This will return an array of all articles that are currently available.
* [x] [GET /api/articles/:article_id](localhost:9090/api/articles/:article_id) - This will return a single article that matches the requested ID passed in by the user.
* [x] [PATCH /api/articles/:article_id](localhost:9090/api/articles/:article_id) - This will update the reuested article's vote count based on the value included in the body. For example `{ inc_votes: 5 }` would increease the specified article's vote count by 5, and conversely would decrement the vote count by 5 with the following: `{ inc_votes: -5}`  
* [x] [GET /api/articles/:article_id/comments](localhost:9090/api/articles/:article_id/comments) - This will return an array of comments for the requested article.
* [x] [POST /api/articles/:article_id/comments](localhost:9090/api/articles/:article-id/comments) - This will add a new comment to the requested article and will serve the posted comment to the user as confirmation for a successful post request.
* [x] [DELETE /api/comments/:comment_id](localhost:9090/api/comments/:comment_id) - This will delete a specified comment that matches ID requested by the user. 
