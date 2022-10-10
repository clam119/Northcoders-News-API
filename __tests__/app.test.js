const app = require('../app');
const db = require('../db/connection');
const request = require('supertest');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed');
const { 
convertTimestampToDate, 
createRef, 
formatComments }  = require('../db/seeds/utils');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Northcoders News API', () => {

    it('Status: 404 - If the user tries to access an unknown path', () => {
        return request(app)
        .get('/api/not-a-route')
        .expect(404)
    });

    describe('GET /api/topics', () => {
        it.only('Status: 200 - Should respond with an array of all of the topics.', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({_body: {topicsData}}) => {
                expect(Array.isArray(topicsData)).toBe(true)
                topicsData.forEach((topic) => {
                    const topicKeys = Object.keys(topic);
                    expect(topicKeys).toContain('slug');
                    expect(topicKeys).toContain('description');
                })
            })
        })
    })
})