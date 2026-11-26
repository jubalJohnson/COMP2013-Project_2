//Backend server
//imports
import express, { response, type Express } from "express";
import mongoosse from "mongoose";
import cors from "cors";
import "dotenv/config";
import ClothesItem from "./models/clothesItem";

//constants Vasriables
const server: Express = express();
const port: Number = 3000;
const { MONGO_URI } = process.env;

//middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

//Connect to db and start the server
if (!MONGO_URI) {
  throw new Error("Mongo URI is not found in .env file");
}
mongoosse
  .connect(MONGO_URI)
  .then(() =>
    server.listen(port, () => {
      console.log(`Connected to DB\nServer is listing on port ${port}`);
    }),
  )
  .catch((error) => console.log(error));

//Routes
server.get("/", (request, response) => {
  response.send("Serveris live");
});

//Get data api rout

server.get("/data", async (request, response) => {
  try {
    const data = await ClothesItem.find();
    response.status(200).send(data);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//post route to add a clothing item to the db
server.post("/data", async (request, response) => {
  const {
    id,
    name,
    image,
    fit,
    category,
    size,
    color,
    description,
    price,
    quantity,
    itemQuantity,
  } = request.body;

  const newArticle = new ClothesItem({
    id,
    name,
    image,
    fit,
    category,
    size,
    color,
    description,
    price,
    quantity,
    itemQuantity,
  });
  try {
    await newArticle.save();
    response.status(201).send({
      message: `The new item with id ${id} has been added sucessfully`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//DELETE routr to delete one clothes article by id
server.delete("/data/:id", async (request, response) => {
  //because params will convert the id to string, we have to reconvert it to a number
  //to abide by model schema
  const id = Number(request.params.id);
  try {
    await ClothesItem.findOneAndDelete({ id });
    response
      .status(201)
      .send({ message: `Item with id ${id} has been sucessfully deleted` });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//PATCH route to edit one clothes article by id
server.patch("/data/:id", async (request, response) => {
  const id = Number(request.params.id);
  const clothesArticle = request.body;
  try {
    await ClothesItem.findOneAndUpdate({ id }, { ...clothesArticle });
    response
      .status(201)
      .send({ message: `Item with id ${id} has been successfully updated` });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});
