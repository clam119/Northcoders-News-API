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
          expect(articleKeys).toHaveLength(7);
          expect(articleData[0]).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          });
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
              expect.objectContaining( {
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
              })
            )
          })
        });
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it('Status: 200 - Should respond with an article that has successfully had its voted increased to 150 from 100.', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({inc_votes: 50})
    .expect(200)
    .then(({_body: {updatedArticleData}}) => {
      const updatedArticle = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging", 
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 150
      }
      expect(updatedArticleData).toEqual(updatedArticle);
    })
  })

  it('Status: 200 - Should respond with an article that has successfully had its voted decreased to 0 from 100.', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({inc_votes: -100})
    .expect(200)
    .then(({_body: {updatedArticleData}}) => {
      const updatedArticle = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging", 
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 0
      }
      expect(updatedArticleData).toEqual(updatedArticle);
    })
  })


})