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
  // *npm run dev
    // ?this shows experimental environment that you are able to create
  // *npm run dev:test 
    //? this shows the test environment where you can test
  // * npm run seed
    // ? this seeds the file 
  // *Look at the package.json for more info


// /DOGS
//INDEX ENDPOINT
app.get('/dogs', async(req, res) => {
  const allDogs = await prisma.dog.findMany();
  // console.log(allDogs, 'allDogs');
  res.status(200).send(allDogs);
})

// /DOGS/:ID
// SHOW ENDPOINT
app.get('/dogs/:id', async(req, res) => {

  const id = +req.params.id;
  if(isNaN(id)) {
    res.status(400).send({message :"id should be a number"})
  }
  try {
    const dogs = await prisma.dog.findUnique({
      where: {
        id: id
      }
    });
    if(!dogs) {
      res.status(204).send("No Dogs")
    }
    res.status(200).send(dogs);

  } catch(e) {
    console.error(e);
    return res.status(204).send("No Doggos");
  }


})


//  /DOGS
//  CREATE ENDPOINT
app.post("/dogs", async(req, res) => {
  const {age, name, description, breed} = req.body;
  // console.log(req.body, 'body');
  if(age === null || typeof age !== "number") {
    return res.status(400).send({error: "age should be a number"})
  }
  if(typeof name !== "string") {
    return res.status(400).send({error: "name should be a string"})
  }
  if(typeof description !== "string") {
    return res.status(400).send({error: "description should be a string"})
  }
  if(typeof breed !== "string") {
    return res.status(400).send({error: "breed should be a string"})
  }


  try {
    const newDogs = await prisma.dog.create({
      data: {
         age,
         name,
         description,
         breed
      }
    })
    return res.status(201).send(newDogs);
  } catch(e) {
    console.error(e);
    return res.status(500).send({error: "errorr 500"})
  }
})


//  /DOGS/:id
// UPDATE ENDPOINT


//  /DOGS/:ID
// DELETE ENDPOINT



// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
