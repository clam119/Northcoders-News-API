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
          expect(articleData[0]).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });

    it("Status: 404 - Should respond with a message declaring that the specified article doesn't exist", () => {
        return request(app)
        .get('/api/articles/100000')
        .expect(404)
        .then(({text: msg}) => {
            expect(msg).toBe('That article does not exist');
        })
    })
  });
});
