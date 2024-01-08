import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";

const app = express();
app.use(express.json());
// All code should go below this line

// testDogs Endpoint
app.get("/", (_req, res) => {
  res.json({ message: "Hello World!" }).status(200); // the 'status' is unnecessary but wanted to show you how to define a status
});

// BEFORE YOU START:
// /DOGS
//INDEX ENDPOINT
app.get("/dogs", async (req, res) => {
  const allDogs = await prisma.dog.findMany();
  res.status(200).send(allDogs);
});

// /DOGS/:ID
// SHOW ENDPOINT
app.get("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  if (isNaN(id)) {
    res
      .status(400)
      .send({ message: "id should be a number" });
  }
  try {
    const dogs = await prisma.dog.findUnique({
      where: {
        id: id,
      },
    });
    if (!dogs) {
      res.status(204).send("No Dogs");
    }
    res.status(200).send(dogs);
  } catch (e) {
    console.error(e);
    return res.status(204).send("No Doggos");
  }
});

//  /DOGS
//  CREATE ENDPOINT
app.post("/dogs", async (req, res) => {
  const { age, name, description, breed } = req.body;
  const validKeys = ["name", "description", "age", "breed"];
  const errors: string[] = [];

  const invalidKeys = Object.keys(req.body).filter(
    (item) => {
      return !validKeys.includes(item);
    }
  );

  if (invalidKeys) {
    for (const key of invalidKeys) {
      errors.push(`'${key}' is not a valid key`);
    }
  }
  if (errors.length > 0) {
    return res.status(400).send({ errors });
  }
  if (typeof age !== "number" || isNaN(age)) {
    errors.push("age should be a number");
  }
  if (typeof name !== "string") {
    errors.push("name should be a string");
  }
  if (typeof description !== "string") {
    errors.push("description should be a string");
  }

  if (errors.length > 0) {
    return res.status(400).send({ errors });
  }

  try {
    const newDog = await prisma.dog.create({
      data: {
        age,
        name,
        description,
        breed,
      },
    });
    return res.status(201).send(newDog);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: "errorr 500" });
  }
});

//  /DOGS/:id
// UPDATE ENDPOINT aka Patch
app.patch("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  const { description, name, age, breed } = req.body || {};
  const validKeys = ["name", "description", "age", "breed"];
  const errors = [];

  const invalidKeys = Object.keys(req.body).filter(
    (item) => {
      return !validKeys.includes(item);
    }
  );

  if (invalidKeys) {
    for (const key of invalidKeys) {
      errors.push(`'${key}' is not a valid key`);
    }
  }
  if (errors.length > 0) {
    return res.status(400).send({ errors });
  }

  try {
    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(age && { age }),
      ...(breed && { breed }),
    };

    const updateDog = await prisma.dog.update({
      data: updateData,
      where: {
        id: id,
      },
    });
    return res.status(201).send(updateDog);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: "errorr 500" });
  }
});

//  /DOGS/:ID
// DELETE ENDPOINT
app.delete("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  if (isNaN(id)) {
    res
      .status(400)
      .send({ message: "id should be a number" });
  }
  try {
    const deletedDog = await prisma.dog.delete({
      where: {
        id: id,
      },
    });
    if (!deletedDog) {
      return res.status(400).send("Dog is not delted");
    }

    return res.status(200).send(deletedDog);
  } catch (e) {
    console.error(e);
    return res.status(204).send("Internal Server Error");
  }
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
