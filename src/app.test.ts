import request from "supertest";
import app from "./app";
describe("Todo API", () => {
  it("should get all todos", async () => {
    const res = await request(app).get("/todos");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should create a new todo", async () => {
    const res = await request(app).post("/todos").send({
      task: "Test task",
      completed: false,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.task).toEqual("Test task");
    expect(res.body.completed).toEqual(false);
  });

  it("should get a todo", async () => {
    const res = await request(app).post("/todos").send({
      task: "Test task",
      completed: false,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    const todo = res.body;
    const res2 = await request(app).get("/todos/id/" + todo.id);
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.id).toEqual(todo.id);
    expect(res2.body.task).toEqual(todo.task);
  });

  it("should update a todo", async () => {
    const res = await request(app).post("/todos").send({
      task: "Test task",
      completed: false,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    const todo = res.body;
    const res2 = await request(app)
      .put("/todos/id/" + todo.id)
      .send({
        task: "Update task",
        completed: true,
      });
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toHaveProperty("id");
    expect(res2.body.id).toEqual(todo.id);
    expect(res2.body.task).toEqual("Update task");
    expect(res2.body.completed).toEqual(true);
  });

  it("should delete a todo", async () => {
    const res = await request(app).post("/todos").send({
      task: "Test task",
      completed: false,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.task).toEqual("Test task");
    const todo = res.body;
    const res2 = await request(app).delete("/todos/id/" + res.body.id);
    expect(res2.statusCode).toEqual(204);
    const res3 = await request(app).get("/todos/id/" + res.body.id);
    expect(res3.statusCode).toEqual(404);
  });

  it("should filter todos by completion status", async () => {
    await request(app)
      .get("/todos/filter/completed")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        response.body.forEach(
          (todo: { task: string; completed: boolean; id: number }) => {
            expect(todo.completed).toBe(true);
          }
        );
      });
  });

  it("should search todos by given word", async () => {
    const res = await request(app).post("/todos").send({
      task: "Test task",
      completed: false,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.task).toEqual("Test task");
    const todo = res.body;
    const res2 = await request(app).get("/todos/search?keyword=" + "task");
    expect(res2.statusCode).toEqual(200);
  });
});
