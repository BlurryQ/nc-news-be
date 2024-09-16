const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("Endpoint testing for NC News", () => {
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

  describe("GET /api/users - returns an array of user objects", () => {
    it("200: returns all users (total 4), each object containing the users username, name and avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).toBe(4);
          body.users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
    it("200: returns all users in alphabetical order by username", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toBeSortedBy("username");
        });
    });
  });

  describe("GET /api/users/:username - returns the specified user object", () => {
    it("returns the specified user, containing their username, name and avatar_url", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body }) => {
          const result = {
            user: {
              username: "icellusedkars",
              name: "sam",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
            },
          };
          expect(body).toEqual(result);
        });
    });
    it("404: responds with 'not found' when a username is entered but user does not exist", () => {
      return request(app)
        .get("/api/users/jazz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });

  describe("GET /api/topics - returns an array of topic objects", () => {
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
    it("200: returns articles sorted by votes in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("votes", {
            descending: true,
          });
        });
    });
    it("200: returns articles sorted by topic in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("topic");
        });
    });
    it("200: returns articles sorted by title in ascending order, ignoring case sensitivity", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=aSc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title");
        });
    });
    it("200: returns articles filtered by topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(1);
        });
    });
    it("200: returns the appropriate results when limit is 3", () => {
      const result = {
        totalCount: 3,
        articles: [
          {
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            author: "icellusedkars",
            title: "A",
            article_id: 6,
            topic: "mitch",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "1",
          },
          {
            author: "icellusedkars",
            title: "Sony Vaio; or, The Laptop",
            article_id: 2,
            topic: "mitch",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
        ],
      };
      return request(app)
        .get("/api/articles?limit=3")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(body.totalCount);
          expect(body).toEqual(result);
        });
    });
    it("200: returns the appropriate results when limit is 5 and page is 2", () => {
      const result = {
        totalCount: 5,
        articles: [
          {
            author: "rogersop",
            title: "UNCOVERED: catspiracy to bring down democracy",
            article_id: 5,
            topic: "cats",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "11",
          },
          {
            author: "butter_bridge",
            title: "They're not exactly dogs, are they?",
            article_id: 9,
            topic: "mitch",
            created_at: "2020-06-06T09:10:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            author: "rogersop",
            title: "Seven inspirational thought leaders from Manchester UK",
            article_id: 10,
            topic: "mitch",
            created_at: "2020-05-14T04:15:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "rogersop",
            title: "Student SUES Mitch!",
            article_id: 4,
            topic: "mitch",
            created_at: "2020-05-06T01:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
        ],
      };
      return request(app)
        .get("/api/articles?page=2&limit=5")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(body.totalCount);
          expect(body).toEqual(result);
        });
    });
    it("200: returns all results when limit exceeds total amount of data", () => {
      const result = {
        totalCount: 13,
        articles: [
          {
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            author: "icellusedkars",
            title: "A",
            article_id: 6,
            topic: "mitch",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "1",
          },
          {
            author: "icellusedkars",
            title: "Sony Vaio; or, The Laptop",
            article_id: 2,
            topic: "mitch",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "butter_bridge",
            title: "Moustache",
            article_id: 12,
            topic: "mitch",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "butter_bridge",
            title: "Another article about Mitch",
            article_id: 13,
            topic: "mitch",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "rogersop",
            title: "UNCOVERED: catspiracy to bring down democracy",
            article_id: 5,
            topic: "cats",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "11",
          },
          {
            author: "butter_bridge",
            title: "They're not exactly dogs, are they?",
            article_id: 9,
            topic: "mitch",
            created_at: "2020-06-06T09:10:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            author: "rogersop",
            title: "Seven inspirational thought leaders from Manchester UK",
            article_id: 10,
            topic: "mitch",
            created_at: "2020-05-14T04:15:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "rogersop",
            title: "Student SUES Mitch!",
            article_id: 4,
            topic: "mitch",
            created_at: "2020-05-06T01:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "icellusedkars",
            title: "Does Mitch predate civilisation?",
            article_id: 8,
            topic: "mitch",
            created_at: "2020-04-17T01:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "icellusedkars",
            title: "Am I a cat?",
            article_id: 11,
            topic: "mitch",
            created_at: "2020-01-15T22:21:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            author: "icellusedkars",
            title: "Z",
            article_id: 7,
            topic: "mitch",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
        ],
      };
      return request(app)
        .get("/api/articles?limit=15")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(body.totalCount);
          expect(body).toEqual(result);
        });
    });
    it("200: returns the last available article when on the last page and less than the limit remain", () => {
      const result = {
        totalCount: 1,
        articles: [
          {
            author: "icellusedkars",
            title: "Z",
            article_id: 7,
            topic: "mitch",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
        ],
      };
      return request(app)
        .get("/api/articles?page=4&limit=4")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(body.totalCount);
          expect(body).toEqual(result);
        });
    });
    it("400: responds with 'bad request' when page is invalid or page doesn't exist", () => {
      return request(app)
        .get("/api/articles?page=10&limit=5")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("bad request");
        })
        .then(() => {
          return request(app)
            .get("/api/articles?page=age&limit=5")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("bad request");
            });
        });
    });
    it("400: responds with 'bad request' when limit is invalid", () => {
      return request(app)
        .get("/api/articles?limit=age")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("400: responds with 'bad request' when order is invalid or doesn't exist", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=5")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("404: responds with 'bad request' when sort is invalid or doesn't exist", () => {
      return request(app)
        .get("/api/articles?sort_by=bod")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
    it("404: responds with 'not found' when topic is invalid or doesn't exist", () => {
      return request(app)
        .get("/api/articles?topic=title")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
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
    it("200: returns article contains a count of articles comments", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.comment_count).toBe("11");
        });
    });
    it("200: returns article contains a count of articles comments when article has no comments", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.comment_count).toBe("0");
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
    it("200: returns empty array if article exists but no comments are present", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
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
    it("404: responds with 'not found' when a valid article ID datatype is entered, but article does not exist", () => {
      return request(app)
        .get("/api/articles/70/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });

  describe("POST /api/articles - posts an article (via an object) and returns the posted article", () => {
    it("201: successfully posts an article to endpoint and recieves article object back", () => {
      const newArticle = {
        author: "icellusedkars",
        title: "Windy Road",
        body: "A very interesting read full of twists and turns",
        topic: "paper",
        article_img_url:
          "https://as1.ftcdn.net/v2/jpg/01/17/18/72/1000_F_117187243_oxda4jQ0sd1dTFhY7CSn6QMofcQKPqM3.jpg",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("created_at");
          expect(body.article).toMatchObject({
            article_id: 14,
            votes: 0,
            comment_count: 0,
            author: "icellusedkars",
            title: "Windy Road",
            body: "A very interesting read full of twists and turns",
            topic: "paper",
            article_img_url:
              "https://as1.ftcdn.net/v2/jpg/01/17/18/72/1000_F_117187243_oxda4jQ0sd1dTFhY7CSn6QMofcQKPqM3.jpg",
          });
          return body;
        })
        .then((returnedarticle) => {
          return request(app)
            .get("/api/articles/14")
            .expect(200)
            .then(({ body }) => {
              body.article.comment_count = Number(body.article.comment_count);
              expect(body).toMatchObject(returnedarticle);
            });
        });
    });
    it("201: successfully posts an article to endpoint and uses default image url when none is given", () => {
      const newArticle = {
        author: "icellusedkars",
        title: "Windy Road",
        body: "A very interesting read full of twists and turns",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("created_at");
          expect(body.article).toMatchObject({
            article_id: 14,
            votes: 0,
            comment_count: 0,
            author: "icellusedkars",
            title: "Windy Road",
            body: "A very interesting read full of twists and turns",
            topic: "paper",
            article_img_url:
              "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          });
          return body;
        })
        .then((returnedarticle) => {
          return request(app)
            .get("/api/articles/14")
            .expect(200)
            .then(({ body }) => {
              body.article.comment_count = Number(body.article.comment_count);
              expect(body).toMatchObject(returnedarticle);
            });
        });
    });

    it("400: responds with 'bad request' when article body contains invalid datatypes", () => {
      const badTitle = {
        author: "icellusedkars",
        title: [1, 2],
        body: "A very interesting read full of twists and turns",
        topic: "paper",
      };
      const badBody = {
        author: "icellusedkars",
        title: "Windy Road",
        body: { a: 1, b: 2 },
        topic: "paper",
      };
      const badTopic = {
        author: "icellusedkars",
        title: "Windy Road",
        body: "A very interesting read full of twists and turns",
        topic: null,
      };
      return request(app)
        .post("/api/articles")
        .send(badTitle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        })
        .then(() => {
          return request(app)
            .post("/api/articles")
            .send(badBody)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("bad request");
            });
        })
        .then(() => {
          return request(app)
            .post("/api/articles")
            .send(badTopic)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("bad request");
            });
        });
    });
    it("404: responds with 'not found' when username is invalid", () => {
      const newArticle = {
        author: "jazz",
        title: "Windy Road",
        body: "A very interesting read full of twists and turns",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });

  describe("POST /api/articles/:article_id/comment - posts a comment (via an object with username and body keys) and returns the posted comment", () => {
    it("201: successfully posts a comment to endpoint and recieves comment object back", () => {
      return request(app)
        .post("/api/articles/7/comment")
        .send({ username: "icellusedkars", body: "comment" })
        .expect(201)
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
        .post("/api/articles/one/comment")
        .send({ username: "icellusedkars", body: "comment" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("400: responds with 'bad request' when comment body is invalid datatype", () => {
      return request(app)
        .post("/api/articles/5/comment")
        .send({ username: "icellusedkars", body: [1, 2] })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        })
        .then(() => {
          return request(app)
            .post("/api/articles/5/comment")
            .send({ username: "icellusedkars", body: { a: 1, b: 2 } })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("bad request");
            });
        });
    });
    it("404: responds with 'not found' when article ID is valid, but article does not exist", () => {
      return request(app)
        .post("/api/articles/888/comment")
        .send({ username: "icellusedkars", body: "comment" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
    it("404: responds with 'not found' when username is invalid", () => {
      return request(app)
        .post("/api/articles/5/comment")
        .send({ username: "jazz", body: "comment" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });

  describe("PATCH /api/articles/:article_id - adjusts the specified articles vote count (via an object with inc_votes key) and returns the updated article", () => {
    it("200: successfully increases the article vote count and recieves article object back", () => {
      const updatedArticle = {
        article: {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      };
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(updatedArticle);
        });
    });
    it("200: successfully decreases the article vote count and recieves article object back", () => {
      const updatedArticle = {
        article: {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 10,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      };
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -90 })
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(updatedArticle);
        });
    });
    it("400: responds with 'bad request' when article ID has invalid datatype", () => {
      return request(app)
        .patch("/api/articles/one")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("400: responds with 'bad request' when inc_votes is invalid datatype", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "ten" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("404: responds with 'not found' when article ID is valid, but article does not exist", () => {
      return request(app)
        .patch("/api/articles/200")
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });

  describe("DELETE /api/comments/:comment_id - deletes the specified comment", () => {
    it("204: successfully deletes the specified comment", () => {
      return request(app)
        .delete("/api/comments/10")
        .expect(204)
        .then(() => {
          return request(app)
            .get("/api/articles/3/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).toBe(1);
            });
        });
    });
    it("400: responds with 'bad request' when comment ID has invalid datatype", () => {
      return request(app)
        .delete("/api/comments/ten")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("404: responds with 'not found' when comment ID is valid, but comment does not exist", () => {
      return request(app)
        .delete("/api/comments/123")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });

  describe("PATCH /api/comments/:comment_id - adjusts the specified comments vote count (via an object with inc_votes key) and returns the updated comment", () => {
    it("200: successfully increases the comments vote count and recieves comment object back", () => {
      const updatedComment = {
        comment: {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 20,
          author: "butter_bridge",
          article_id: 9,
        },
      };
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 4 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toHaveProperty("created_at");
          expect(body).toMatchObject(updatedComment);
        });
    });
    it("200: successfully decreases the article vote count and recieves article object back", () => {
      const updatedComment = {
        comment: {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 6,
          author: "butter_bridge",
          article_id: 9,
        },
      };
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toHaveProperty("created_at");
          expect(body).toMatchObject(updatedComment);
        });
    });
    it("400: responds with 'bad request' when article ID has invalid datatype", () => {
      return request(app)
        .patch("/api/comments/one")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("400: responds with 'bad request' when inc_votes is invalid datatype", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "ten" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("404: responds with 'not found' when article ID is valid, but article does not exist", () => {
      return request(app)
        .patch("/api/comments/200")
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });
});
