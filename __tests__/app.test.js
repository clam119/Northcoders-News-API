const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("../db/seeds/utils");
beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Northcoders News API", () => {
  it("Status: 404 - If the user tries to access an unknown path", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });

describe("GET /api", () => {
  it("Status: 200 - Should respond with a JSON object that describes all of the availlable endpoints", () => {
    return request(app)
    .get("/api")
    .expect(200)
  })
})
});

describe('TOPIC TESTS', () => {

  describe("GET /api/topics", () => {
      it("Status: 200 - Should respond with an array of all of the topics.", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ _body: topicsData }) => {
            expect(Array.isArray(topicsData)).toBe(true);
            expect(topicsData.length).toBe(3);
            topicsData.forEach((topic) => {
              const topicKeys = Object.keys(topic);
              expect(topicKeys).toContain("slug");
              expect(topicKeys).toContain("description");
            });
          });
      });
    });

    describe("POST /api/topics", () => {
      it.only("Status: 201 - Should respond with the newly added topic object", async () => {
        const newTopic = { slug: "Northcoders Spooky Night", description: "Anything related to NC's Spooky Lightning Talks"}
        const response = await request(app).post("/api/topics").send(newTopic).expect(201)
        const { _rows: postedTopic } = await response;
        expect(Object.keys(postedTopic)).toHaveLength(3);
        expect(postedTopic).toEqual({
          topic_id: 3,
          slug: "Northcoders Spooky Night",
          description: "Anything related to NC's Spooky Lightning Talks"
        })
      })

    })
})

describe('USERS TESTS', () => {

  describe("GET /api/users", () => {
      it("Status: 200 - Should respond with an array of all of the users.", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ _body: usersData }) => {
            expect(Array.isArray(usersData)).toBe(true);
            expect(usersData).toHaveLength(4);
            usersData.forEach((user) => {
              expect(user).toMatchObject(
                {
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                })
            });
          });
      });
    });
  
    describe("GET /api/users/:username", () => {
      it("Status: 200 - Should respond with a user object that has three properties for given valid user", async () => {
        const response = await request(app).get('/api/users/rogersop').expect(200)
        const data = await response;
        const { _body: userData } = data;
        expect(Object.keys(userData)).toHaveLength(3);
        expect(typeof userData).toBe('object');
        expect(userData).toMatchObject({
          username: 'rogersop',
          name: 'paul',
          avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
        })
      })
  
      it("Status: 404 - Should respond with a message saying no user found with that username if non-existent", async () => {
        const response = await request(app).get('/api/users/notActualUsername').expect(404);
        const data = await response;
        const { text: msg } = data;
        expect(msg).toBe("Username not found");
      })
    })
})

describe('ARTICLE TESTS', () => {

  describe("GET /api/articles", () => {
      it("Status: 200 - Should respond with an array of all article objects sorted by creation date in descending order.", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ _body: allArticlesData }) => {
            expect(allArticlesData).toHaveLength(12);
            expect(allArticlesData).toBeSortedBy("created_at", {
              descending: true,
            });
          allArticlesData.forEach((article) => {
            expect(article).toMatchObject(
              {
                article_id: expect.any(Number),
                title: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            ;
          });
        });
      });
  
      it("Status: 200 - Should respond with an array of all article objects sorted by creation date in descending order if not passed in any query", () => {
        return request(app)
          .get("/api/articles?topic=")
          .then(({ _body: allArticlesData }) => {
            expect(allArticlesData).toHaveLength(12);
            expect(allArticlesData).toBeSortedBy("created_at", {
              descending: true,
            });
            allArticlesData.forEach((article) => {
              expect(article).toMatchObject(
               {
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(String),
                })
            });
          });
      });
  
      it("Status: 200 - Should respond with an array of all article objects with the topic filtered to mitch", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .then(({ _body: allMitchArticles }) => {
            expect(allMitchArticles).toHaveLength(11);
            expect(allMitchArticles).toBeSortedBy("created_at", {
              descending: true,
            });
            allMitchArticles.forEach((article) => {
              expect(article).toMatchObject({ topic: "mitch" })
            });
          });
      });
  
      it("Status: 200 - Should respond with an array of all article objects sorted by votes in default descending order", () => {
        return request(app)
        .get("/api/articles?sort_by=votes")
        .then(({_body: allArticles}) => {
          expect(allArticles).toBeSortedBy("votes", {descending: true});
        })
      })
  
      it("Status: 200 - Should respond with an array of all article objects sorted by votes in ascending order", () => {
        return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .then(({_body: allArticles}) => {
          expect(allArticles).toBeSortedBy("votes", {ascending: true});
        })
      })
  
      it("Status: 200 - Should respond with array of all mitch filtered articles sorted by descending order of votes", () => {
        return request(app)
        .get("/api/articles?topic=mitch&sort_by=votes")
        .then(({_body: mitchArticles}) => {
          expect(mitchArticles).toHaveLength(11);
          mitchArticles.forEach((article) => {
            const articleValues = Object.values(article);
            expect(articleValues.includes('mitch')).toBe(true);
          })
          expect(mitchArticles).toBeSortedBy("votes", {descending: true});
        })
      })
  
      it("Status: 400 - Should respond with invalid data type message if passed in an invalid sort_by query", () => {
        return request(app)
        .get("/api/articles?sort_by=TIMETOSQLINJECT")
        .expect(400)
        .then(({text: msg}) => {
          expect(msg).toBe('Invalid Data Type');
        })
      })
  
      it("Status: 400 - Should respond with invalid data type if passed in an invalid order query", () => {
        return request(app)
        .get("/api/articles?sort_by=votes&order=SQLINJECTNUMBERTWO")
        .expect(400)
        .then(({text: msg}) => {
          expect(msg).toBe('Invalid Data Type');
        })
      })
  
      it("Status: 404` - Should respond with a message saying that they entered in an invalid data type on query", () => {
        return request(app)
          .get("/api/articles?topic=not-a-real-topic")
          .expect(404)
          .then(({ text: msg }) => {
            expect(msg).toBe("Article with that topic not found");
          });
      });
  
      it("Status: 404 - Should respond with a message saying that there are no articles with the topic of slug", () => {
        return request(app)
          .get("/api/articles?topic=slug")
          .expect(404)
          .then(({ text: msg }) => {
            expect(msg).toBe("Article with that topic not found");
          });
      });
    });

  describe("POST /api/articles", () => {
      it("Status: 201 - Should respond with the newly added article if given a valid article object", async () => {
        const newArticle = { author: 'rogersop', title: 'The Pains Of YAML', body: 'Now do not get me started on YAML', topic: 'mitch'}
        const response = await request(app).post('/api/articles').send(newArticle).expect(201)
        const { _body: createdArticle } = await response;
        expect(Object.keys(createdArticle)).toHaveLength(8);
        expect(createdArticle).toMatchObject({
          article_id: 13,
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
          author: 'rogersop',
          title: 'The Pains Of YAML',
          body: 'Now do not get me started on YAML',
          topic: 'mitch'
        });
      })
    
      it("Status: 404 - Should respond with message telling the user they can't leave a field empty", async () => {
        const newArticle = {};
        const response = await request(app).post('/api/articles').send(newArticle).expect(404);
        const { text: msg } = await response;
        expect(msg).toBe('Field Missing');
      })
    
      it("Status: 404 - Should respond with a 'Username Not Found' error message if the user does not exist", async () => {
        const newArticle = { author: 'notARealUsername', title: 'The Pains Of YAML', body: 'Now do not get me started on YAML', topic: 'mitch'}
        const response = await request(app).post('/api/articles').send(newArticle).expect(404)
        const { text:  msg } = await response;
        expect(msg).toBe('Username Not Found');
      })
    
      it("Status: 404 - Should respond with a 'Topic Not Found' error message if the topic does not exist", async () => {
        const newArticle = { author: 'notARealUsername', title: 'The Pains Of YAML', body: 'Now do not get me started on YAML', topic: 'notARealTopic'}
        const response = await request(app).post('/api/articles').send(newArticle).expect(404)
        const { text:  msg } = await response;
        expect(msg).toBe('Username Not Found');
      })
    });

  describe("GET /api/articles/:article_id", () => {
      it("Status: 200 - Should respond with an article corresponding to the idea given.", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ _body: articleData }) => {
            const articleKeys = Object.keys(articleData);
            expect(articleKeys).toHaveLength(8);
            expect(articleData).toMatchObject(
              {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
              })
          });
      });
  
      it("Status: 200 - Should respond with an article corresponding to the article_id of 4 given with the comment count of 0 if no comments", () => {
        return request(app)
          .get("/api/articles/4")
          .expect(200)
          .then(({ _body: articleData }) => {
            expect(articleData).toMatchObject(
              {
                article_id: 4,
                comment_count: "0",
              })
          });
      });
  
      it("Status: 200 - Should respond with an article corresponding to the article_id of 1 and have a property that has a comment count of 11", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ _body: articleData }) => {
            expect(articleData).toMatchObject(
              {
                article_id: 1,
                comment_count: "11",
              })
          });
      });
  
      it("Status: 400 - Should respond with a message declaring that the parameter passed in is not a number", () => {
        return request(app)
          .get("/api/articles/not-a-number")
          .expect(400)
          .then(({ text: msg }) => {
            expect(msg).toBe("Invalid Data Type");
          });
      });
  
      it("Status: 404 - Should respond with a message declaring that the specified article doesn't exist", () => {
        return request(app)
          .get("/api/articles/100000")
          .expect(404)
          .then(({ text: msg }) => {
            expect(msg).toBe("Article not found");
          });
      });
    });
  
  describe("PATCH /api/articles/:article_id", () => {
      it("Status: 200 - Should respond with an article that has successfully had its votes increased to 150 from 100.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 50 })
          .expect(200)
          .then(({ _body: articleData }) => {
            const updatedArticle = {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 150,
            };
            expect(articleData).toEqual(updatedArticle);
          });
      });
  
      it("Status: 200 - Should respond with an article that has successfully had its voted decreased to 0 from 100.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -100 })
          .expect(200)
          .then(({ _body: updatedArticleData }) => {
            const updatedArticle = {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 0,
            };
            expect(updatedArticleData).toEqual(updatedArticle);
          });
      });
  
      it("Status: 400 - Should respond with a message saying that the user has passed in an invalid data type on the PATCH request", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "String" })
          .expect(400)
          .then(({ text: msg }) => {
            expect(msg).toBe("Invalid Data Type");
          });
      });
  
      it("Status: 400 - Should respond with a message saying that the user has passed in an empty object on the PATCH request", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
          .then(({ text: msg }) => {
            expect(msg).toBe("Invalid Data Type");
          });
      });
  
      it("Status: 404 - Should respond with a message declaring that the specified article doesn't exist on the PATCH request", () => {
        return request(app)
          .get("/api/articles/123456789")
          .expect(404)
          .then(({ text: msg }) => {
            expect(msg).toBe("Article not found");
          });
      });
    });
  
  describe("GET /api/articles/:article_id/comments", () => {
      it("Status: 200 - Should respond with an array of the comments for the given article id of 1 which has 11 comments.", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ _body: comments }) => {
            expect(Array.isArray(comments)).toBe(true);
            expect(comments).toHaveLength(11);
          });
      });
  
      it("Status: 200 - Should respond with an array of comments that each include the following properties: comment_id, votes, created_at, author and body", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ _body: comments }) => {
            comments.forEach((comment) => {
              expect(comment).toMatchObject(
                {
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
            });
          });
      });
  
      it("Status: 200 - Should respond with the comments for article_id 1 that is sorted in descending order with the most recent comments at the top", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .then(({ _body: comments }) => {
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });
  
      it("Status: 200 - Should respond with message saying that no comments not found were found for that article yet.", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .then(({ text: msg }) => {
            expect(msg).toBe("[]");
          });
      });
  
      it("Status: 400 - Should respond with an error of 400 & message saying that the article id is an invalid data type", () => {
        return request(app)
          .get("/api/articles/not-a-number/comments")
          .expect(400)
          .then(({ text: msg }) => {
            expect(msg).toBe("Invalid Data Type");
          });
      });
  
      it("Status: 404 - Should respond with an error of 404 if an article is not found.", () => {
        return request(app)
        .get("/api/articles/500/comments")
        .expect(404)
        .then(({text: msg}) => {
          expect(msg).toBe("Article not found")
        })
      })
    });
  
  describe('POST /api/articles/:article_id/comments', () => {
      it("Status: 201 - Should respond with an object that contains the data posted by the user", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .expect(201)
        .send({ username: "rogersop", body: "This is my first comment!" })
        .then(({_body: postedComment}) => {
          const postedCommentKeys = Object.keys(postedComment);
          expect(postedCommentKeys).toHaveLength(6);
          expect(postedComment).toMatchObject(
            {
              author: "rogersop",
              body: "This is my first comment!",
              article_id: 1,
            })
        })
      })
  
      it("Status: 400 - Should respond with an error code of 400 and a message saying bad request if the user gives no parameters", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .expect(400)
        .send({})
        .then(({text: msg}) => {
          expect(msg).toBe('Bad Request');
        })
      })
  
      it("Status: 404 - Should respond with an error code of 404 if the user tries to post a comment to an article that doesn't exist", () => {
        return request(app)
        .post("/api/articles/3000000/comments")
        .expect(404)
        .send({username: "rogersop", body: "Well this won't work now will it?"})
        .then(({text: msg}) => {
          expect(msg).toBe("Article not found")
        })
      })
    });
  
  
})

describe('COMMENTS TESTS', () => {

  describe("PATCH /api/comments/:comment_id", () => {
      it("Status: 200 - Should respond with the updated comment with the vote increased by 50", async () => {
        const response = await request(app).patch('/api/comments/1').send({inc_votes: 50}).expect(200)
        const { _body: updatedComment } = await response;
        expect(Object.keys(updatedComment)).toHaveLength(6);
        expect(updatedComment).toMatchObject({
          comment_id: 1,
          votes: 66,
          article_id: 9
        })
      })
  
      it("Status: 200 - Should respond with the updated comment with the vote decreased by 50", async () => {
        const response = await request(app).patch('/api/comments/1').send({inc_votes: -50}).expect(200)
        const { _body: updatedComment } = await response;
        expect(Object.keys(updatedComment)).toHaveLength(6);
        expect(updatedComment).toMatchObject({
          comment_id: 1,
          votes: -34,
          article_id: 9
        })
      })
      
      it("Status: 400 - Should respond with an Invalid Data Type error if passed in an empty object in the request body", async () => {
        const response = await request(app).patch('/api/comments/3').send({}).expect(400)
        const {text: msg} = await response;
        expect(msg).toBe("Invalid Data Type");
      })
  
      it("Status: 400 - Should respond with an Invalid Data Type error if passed in an invalid data type in the request body", async () => {
        const response = await request(app).patch('/api/comments/3').send({inc_votes: 'sqlInjectionCentral'}).expect(400)
        const {text: msg} = await response;
        expect(msg).toBe("Invalid Data Type");
      })
  
      it("Status: 404 - Should respond with a message to the user saying that the comment cannot be found if passed in non-existent comment ID", async () => {
        const response = await request(app).patch('/api/comments/3000000').send({inc_votes: 30}).expect(404)
        const {text: msg} = await response;
        expect(msg).toBe("Comment with that ID not found");
      })
  
    })

  describe("DELETE /api/comments/:comment_id", () => {
      it("Status: 204 - Should respond with no body if a comment is successfully deleted", async () => {
        const response = await request(app).delete('/api/comments/1').expect(204)
        const data = await response;
        const { text } = data;
        expect(text).toHaveLength(0);
      })
  
      it("Status: 400 - Should respond with an invalid data type on comment_id if passed in incorrectly", async () => {
        const response = await request(app).delete('/api/comments/SQLINJECTIONTIME').expect(400);
        const data = await response;
        const { text: msg } = data;
        expect(msg).toBe("Invalid Data Type");
      })
  
      it("Status: 404 - Should respond with a message saying comment not found if passed in a valid data type for comment id but does not exist", async () => {
        const response = await request(app).delete('/api/comments/300000').expect(404)
        const data = await response;
        const { text: msg } = data;
        expect(msg).toBe("Comment with that ID not found");
      })
    })

})

