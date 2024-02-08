// backend.js
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import userServices from "./models/user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/users", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log("error"));

    console.log("CONNECTED TO MONGODB!");

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.get("/users", (req, res) => {
      const name = req.query.name;
      const job = req.query.job;

      userServices
        .getUsers(name, job)
        .then((result) => {
          if (result) res.send({ users_list: result });
          else res.status(404).send(`Not Found: ${(name, job)}`);
        })
        .catch((error) => {
          res.status(500).send(error.name);
        });
    });

    app.get("/users/:id", (req, res) => {
      const id = req.params["id"];
      userServices
        .findUserById(id)
        .then((result) => {
          if (result) res.send(result);
          else res.status(404).send(`Not Found: ${id}`);
        })
        .catch((error) => {
          res.status(500).send(error.name);
        });
    });

    app.post("/users", async (req, res) => {
      const userToAdd = req.body;
      userServices
        .addUser(userToAdd)
        .then((result) => res.status(201).send(result))
        .catch((error) => {
          res.status(500).send(error.name);
        });
    });

    app.delete("/users/:id", (req, res) => {
      const id = req.params["id"];
      userServices
        .deleteUserById(id)
        .then((result) => {
          if (result) {res.status(204).send("User has been deleted!");}
          else {res.status(404).send(`Not Found: ${id}`);}
        })
        .catch((error) => {
          res.status(500).send(error.name);
        });
    });

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB!");
  }
};

startServer();
