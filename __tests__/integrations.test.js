const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("Endpoint testing for NC News", () => {
  describe("GET api/topics returns an array of topic objects", () => {
    it("200: returns all topics with both keys (slug & description) having string values", () => {
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
    it("400: responds with 'bad request' when invalid datatype is entered as an ID", () => {
      return request(app)
        .get("/api/articles/one")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("404: responds with 'not found' when a valid ID datatype is entered but article does not exist", () => {
      return request(app)
        .get("/api/articles/20")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });
  describe("GET /api/articles - returns an array of article objects", () => {
    it("200: returns all articles, each containing details about the article (but not the article body)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
          });
        });
    });
    it("200: returns all articles (total 13)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(13);
        });
    });
    it("200: returns articles sorted by creation date in descending order (most recent first)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments - returns an array of comments for the specified article ID", () => {
    it("200: returns all comment objects for the specified article, each containing details about the comment", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          body.comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id");
          });
        });
    });
    it("200: returns the correct amount of comments (total 11)", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(11);
        });
    });
    it("200: returns comments sorted by creation date in descending order (most recent first)", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("400: responds with 'bad request' when invalid datatype is entered as the article ID", () => {
      return request(app)
        .get("/api/articles/one/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("404: responds with 'not found' when a valid article ID datatype is entered, but article does not exist or contain any comments", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments - posts a comment (an object with username and body keys) and returns the posted comment", () => {
    it("200: successfully posts a comment to endpoint and recieves comment object back", () => {
      return request(app)
        .post("/api/articles/7/comments")
        .send({ username: "icellusedkars", body: "comment" })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toHaveProperty("created_at");
          expect(body.comment).toMatchObject({
            article_id: 7,
            author: "icellusedkars",
            body: "comment",
            comment_id: 19,
            votes: 0,
          });
          return body.comment;
        })
        .then((returnedComment) => {
          return request(app)
            .get("/api/articles/7/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toEqual([returnedComment]);
            });
        });
    });
    it("400: responds with 'bad request' when article ID has invalid datatype", () => {
      return request(app)
        .post("/api/articles/one/comments")
        .send({ username: "icellusedkars", body: "comment" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("400: responds with 'bad request' when username is invalid", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({ username: "jazz", body: "comment" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("400: responds with 'bad request' when comment body is invalid datatype", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({ username: "icellusedkars", body: [1, 2] })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        })
        .then(() => {
          return request(app)
            .post("/api/articles/5/comments")
            .send({ username: "icellusedkars", body: { a: 1, b: 2 } })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("bad request");
            });
        });
    });
    it("404: responds with 'not found' when article ID is valid, but article does not exist", () => {
      return request(app)
        .post("/api/articles/888/comments")
        .send({ username: "icellusedkars", body: "comment" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });
});
