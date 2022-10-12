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

  describe("GET /api/topics", () => {
    it("Status: 200 - Should respond with an array of all of the topics.", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ _body: { topicsData } }) => {
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

  describe("GET /api/articles/:article_id", () => {
    it("Status: 200 - Should respond with an article corresponding to the idea given.", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ _body: { articleData } }) => {
          const articleKeys = Object.keys(articleData[0]);
          const requestedArticle = articleData[0];
          expect(articleKeys).toHaveLength(8);
          expect(requestedArticle).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
            })
          );
        });
    });

    it("Status: 200 - Should respond with an article corresponding to the article_id of 4 given with the comment count of 0 if no comments", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then(({ _body: { articleData } }) => {
          const requestedArticle = articleData[0];
          expect(requestedArticle).toEqual(
            expect.objectContaining({
              article_id: 4,
              comment_count: "0",
            })
          );
        });
    });

    it("Status: 200 - Should respond with an article corresponding to the article_id of 1 and have a property that has a comment count of 11", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ _body: { articleData } }) => {
          const requestedArticle = articleData[0];
          expect(requestedArticle).toEqual(
            expect.objectContaining({
              article_id: 1,
              comment_count: "11",
            })
          );
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

  describe("GET /api/users", () => {
    it("Status: 200 - Should respond with an array of all of the users.", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ _body: usersData }) => {
          expect(Array.isArray(usersData)).toBe(true);
          expect(usersData).toHaveLength(4);
          usersData.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    it("Status: 200 - Should respond with an article that has successfully had its voted increased to 150 from 100.", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 50 })
        .expect(200)
        .then(({ _body: { updatedArticleData } }) => {
          const updatedArticle = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 150,
          };
          expect(updatedArticleData).toEqual(updatedArticle);
        });
    });

    it("Status: 200 - Should respond with an article that has successfully had its voted decreased to 0 from 100.", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -100 })
        .expect(200)
        .then(({ _body: { updatedArticleData } }) => {
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

  describe("GET /api/articles", () => {
    it('Status: 200 - Should respond with an array of all article objects sorted by creation date in descending order.', () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({_body: allArticlesData}) => {
        expect(allArticlesData).toHaveLength(12)
        expect(allArticlesData).toBeSortedBy('created_at', { descending: true })
        allArticlesData.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String)
            })
          )
        })
      })
    })

    it('Status: 200 - Should respond with an array of all article objects sorted by creation date in descending order if not passed in any query', () => {
      return request(app)
      .get("/api/articles?topic=")
      .then(({_body: allArticlesData}) => {
        expect(allArticlesData).toHaveLength(12)
        expect(allArticlesData).toBeSortedBy('created_at', { descending: true })
        allArticlesData.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String)
            })
          )
        })
      })
    })

    it('Status: 200 - Should respond with an array of all article objects with the topic filtered to mitch', () => {
      return request(app)
      .get("/api/articles?topic=mitch")
      .then(({_body: allMitchArticles}) => {
        expect(allMitchArticles).toHaveLength(11)
        expect(allMitchArticles).toBeSortedBy('created_at', { descending: true })
        allMitchArticles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining( {
              topic: 'mitch'
            })
          )
        })
      })
    })


  })





});
