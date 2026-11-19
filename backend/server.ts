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
