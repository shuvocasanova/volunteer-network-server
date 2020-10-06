const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// mongodb connection
const uri =
  "mongodb+srv://user1:shuvo140@cluster0.0fzzo.mongodb.net/volunteerDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const volunteerCollection = client
    .db("volunteerNetworkDB")
    .collection("volunteerCollection");
  console.log("dbConnected", err);

  //   register volunteer
  app.post("/registerEvent", (req, res) => {
    const data = req.body;
    volunteerCollection.insertOne(data).then((result) => {
      res.send({ name: "Register Event Successfully" });
    });
  });

  // deleteVolunteer
  app.get("/deleteVolunteer/:id", (req, res) => {
    const id = req.params.id;
    volunteerCollection.deleteOne({ _id: ObjectID(id) }).then((result) => {
      console.log(result);
      res.send("successful");
    });
  });

  //read all events list for admin
  app.get("/admin", (req, res) => {
    volunteerCollection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  // read single user events
  app.get("/userEvent/:email", (req, res) => {
    volunteerCollection
      .find({ email: req.params.email })
      .toArray((err, document) => {
        res.send(document);
      });
  });

  // event Collection
  const eventCollection = client
    .db("volunteerNetworkDB")
    .collection("eventCollection");
  console.log("dbConnected");

  //   add event
  app.post("/addEvent", (req, res) => {
    const data = req.body;
    eventCollection.insertOne(data).then((result) => {
      res.send("Register Event Successfully");
    });
  });
  //   get all events
  app.get("/allEvents", (req, res) => {
    eventCollection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  //   get single event
  app.get("/singleEvent/:id", (req, res) => {
    const id = req.params.id;
    eventCollection.find({ _id: ObjectID(id) }).toArray((err, document) => {
      res.send(document[0]);
    });
  });
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
