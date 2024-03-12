import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

let todos: Todo[] = [];

app.get("/todos", (req: Request, res: Response) => {
  res.json(todos);
});

app.post("/todos", (req: Request, res: Response) => {
  const todo: Todo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: false,
  };
  todos.push(todo);
  res.status(201).json(todo);
});

app.get("/todos/:id", (req: Request, res: Response) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo)
    return res.status(404).send("The todo with the given ID was not found.");
  res.json(todo);
});

app.put("/todos/:id", (req: Request, res: Response) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo)
    return res.status(404).send("The todo with the given ID was not found.");

  const { task, completed } = req.body;
  if (task !== undefined) todo.task = task;
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});

app.delete("/todos/:id", (req: Request, res: Response) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1)
    return res.status(404).send("The todo with the given ID was not found.");

  todos = todos.filter((t) => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.get("/todos/filter/:status", (req: Request, res: Response) => {
  const status = req.params.status;
  if (!["completed", "pending"].includes(status)) {
    return res
      .status(400)
      .send('Invalid status. Please use either "completed" or "pending".');
  }

  const filteredTodos = todos.filter((todo) =>
    status === "completed" ? todo.completed : !todo.completed
  );
  res.json(filteredTodos);
});

app.get("/todos/search", (req: Request, res: Response) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).send("Keyword query parameter is required.");
  }

  const searchResults = todos.filter((todo) =>
    todo.task.toLowerCase().includes((keyword as string).toLowerCase())
  );
  res.json(searchResults);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
