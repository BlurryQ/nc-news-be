const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("Endpoint testing for NC News", () => {
  describe("GET api/topics returns an array of topic objects", () => {
    it("200: returns topics array with both keys (slug & description) having string values", () => {
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
          expect(body).toMatchObject(result);
        });
    });
  });
  describe("GET /api - returns an object of endpoint objects containing information about their use", () => {
    it("200: returns an object where each method-endpoint key contains a description key with a string value", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          for (let key in body.endpoints) {
            const endpoint = body.endpoints[key];
            expect(endpoint).toHaveProperty("description");
            expect(typeof endpoint.description).toBe("string");
          }
        });
    });
    it("200: returns all endpoints with correct key-value pairs", () => {
      const endpoints = require("../endpoints.json");
      const result = {
        endpoints,
      };
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject(result);
        });
    });
  });
  describe("GET /api/articles/:article_id - returns an article object for the specified article ID", () => {
    it("200: returns the article object containing all properties of the specified article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const result = {
            article: {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          };
          expect(body).toMatchObject(result);
        });
    });
    it("400: returns 'bad request' when invalid datatype is entered as an ID", () => {
      return request(app)
        .get("/api/articles/one")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("404: returns 'not found' when an valid ID dataype is entered but article does not exist", () => {
      return request(app)
        .get("/api/articles/20")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });
});
