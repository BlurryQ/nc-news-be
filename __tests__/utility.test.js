const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const { checkIDExists } = require("../db/utility/checkIDExists");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("checkIDExists returns item object if found, or a rejected promise", () => {
  it("returns selected article object from article database when given a valid ID", () => {
    const result = {
      article_id: 5,
      title: "UNCOVERED: catspiracy to bring down democracy",
      topic: "cats",
      author: "rogersop",
      body: "Bastet walks amongst us, and the cats are taking arms!",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    checkIDExists("articles", "article_id", 5).then((article) => {
      expect(article).toHaveProperty("created_at");
      expect(article).toMatchObject(result);
    });
  });
  it("returns selected comment object from comment database when given a valid ID", () => {
    const result = {
      body: "Lobster pot",
      votes: 0,
      author: "icellusedkars",
      article_id: 1,
    };
    checkIDExists("comments", "comment_id", 7).then((comment) => {
      expect(comment).toHaveProperty("created_at");
      expect(comment).toMatchObject(result);
    });
  });
  it("400: returns a rejected promise if invalid table name is entered", async () => {
    await expect(checkIDExists("qwerty", "comment_id", 700)).rejects.toEqual({
      status: 400,
      msg: "bad request",
    });
  });
  it("400: returns a rejected promise if invalid column name is entered", async () => {
    await expect(checkIDExists("users", "qwerty", 700)).rejects.toEqual({
      status: 400,
      msg: "bad request",
    });
    await expect(checkIDExists(1, 5, 700)).rejects.toEqual({
      status: 400,
      msg: "bad request",
    });
  });
  it("400: returns a rejected promise if all entered data is invalid", async () => {
    await expect(checkIDExists(1, 5, "700")).rejects.toEqual({
      status: 400,
      msg: "bad request",
    });
  });
  it("404: returns a rejected promise if valid data but ID does not exist", async () => {
    await expect(checkIDExists("comments", "comment_id", 700)).rejects.toEqual({
      status: 404,
      msg: "not found",
    });
  });
});
