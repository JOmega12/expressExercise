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
  res.send(allDogs);
})

// /DOGS/:ID
// SHOW ENDPOINT

//  /DOGS
// PATCH ENDPOINT


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
