const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

// setting up middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.23ilw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("db connected");
    const database = client.db("cryptosphere");
    const cryptosCollection = database.collection("cryptos");
    const newsCollection = database.collection("news");

    //get news  for specific user
    app.get("/bookmarks/news/:email", async (req, res) => {
      const query = { email: req.params.email };
      const cryptos = await cryptosCollection.find(query).toArray();
      res.status(200).json({
        cryptos,
      });
    });

    // post api for adding a cylcle by admin
    app.post("/bookmarks/addCrypto", async (req, res) => {
      const newCrypto = req.body;
      const result = await cryptosCollection.insertOne(newCrypto);
      console.log(result);
      res.json(result);
    });

    // app.delete("/bookmarks/cryptos/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await bicycleCollection.deleteOne(query);
    //   res.json(result);
    // });

    // app.delete("/bookmarks/news/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await bicycleCollection.deleteOne(query);
    //   res.json(result);
    // });
  } finally {
    //  await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running on port,${port}`);
});
