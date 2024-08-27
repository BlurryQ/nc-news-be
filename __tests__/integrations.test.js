const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("Endpoint testing for NC News", () => {
  describe("GET api/topics returns an array of topic objects", () => {
    it("200: returns topics array with both keys (slug & desciption) having string values", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
          body.topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(typeof topic.slug).toBe("string");

            expect(topic).toHaveProperty("description");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
    it("200: returns all topics with correct key values", () => {
      const result = {
        topics: [
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ],
      };
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(result);
        });
    });
  });
});
