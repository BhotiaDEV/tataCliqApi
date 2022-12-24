let express = require("express");
let app = express();
let dotenv = require("dotenv");
dotenv.config();
let mongo = require("mongodb");
let MongoClient = mongo.MongoClient;
let mongoURL =
  "mongodb+srv://test:test123@cluster0.v86nyzc.mongodb.net/?retryWrites=true&w=majority";
let port = process.env.PORT || 7800;
let bodyparser = require("body-parser");
let cors = require("cors");
// const { RedoTwoTone } = require("@material-ui/icons");
// const { ErrorSharp } = require("@material-ui/icons");
let db;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

// products based on brandId

app.get("/", (req, res) => {
  let brandId = Number(req.query.brandId);
  let query = {};
  if (brandId) query = { brand_id: brandId };
  db.collection("productdata")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// products based on category
app.get("/:categoryId", (req, res) => {
  let categoryId = Number(req.params.categoryId);
  db.collection("productdata")
    .find({ category_id: categoryId })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// filter products based on product type , brands , price and discount
app.get("/filter/:productId", (req, res) => {
  let productId = Number(req.params.productId);
  let lcost = Number(req.query.lcost);
  let hcost = Number(req.query.hcost);
  let mindiscount = Number(req.query.mindiscount);
  let maxdiscount = Number(req.query.maxdiscount);
  let brandId = Number(req.query.brandId);
  let query = {};

  if (brandId && lcost && hcost) {
    query = {
      product_id: productId,
      brand_id: brandId,
      $and: [{ price: { $gt: lcost, $lt: hcost } }],
    };
  } else if (lcost && hcost) {
    query = {
      product_id: productId,
      $and: [{ price: { $gt: lcost, $lt: hcost } }],
    };
  } else if (mindiscount && maxdiscount) {
    query = { discount: { $gt: mindiscount, $lt: maxdiscount } };
  } else if (mindiscount) {
    query = { discount: { $gt: mindiscount } };
  } else if (brandId) {
    query = {
      product_id: productId,
      brand_id: brandId,
    };
  } else {
    query = {
      product_id: productId,
    };
  }
  db.collection("productdata")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// details of product
app.get("/details/:id", (req, res) => {
  let id = Number(req.params.id);
  db.collection("productdata")
    .find({ id: id })
    .toArray((err, result) => {
      if (err) {
        res.send({
          message: "Server side Error",
          status: "500",
        });
      }
      res.send(result);
    });
});

// place a order
app.post("/placeOrder", (req, res) => {
  if (db) {
    db.collection("orders").insertOne(req.body, (err, result) => {
      if (err) {
        res.send({
          message: "! Not found",
          status: "500",
        });
      }
      res.send(result);
    });
  } else {
    res.send({
      message: "Error while connecting to db",
      status: "300",
    });
  }
});

// list of orders w.r.t. email
app.get("/orders/:email", (req, res) => {
  let email = req.params.email;
  db.collection("orderdata")
    .find({ email })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// update payment details
app.put("/updateOrder", (req, res) => {
  if (db)
    db.collection("orderdata").updateOne(
      {
        order_id: Number(req.body.id),
      },
      {
        $set: {
          bank_name: req.body.bank_name,
          status: req.body.status,
          date: req.body.date,
          email: req.body.email,
        },
      },
      (err, result) => {
        if (err) throw err;
        res.send({
          status: 200,
          message: "order updated successfully",
        });
      }
    );
  else {
    res.send({
      message: "db connection error",
      status: "404",
    });
  }
});

// delete order
app.delete("/deleteOrder", (req, res) => {
  let _id = mongo.ObjectId(req.query.id);
  db.collection("orderdata").remove({ _id }, (err, result) => {
    if (err) throw err;
    res.send({
      message: "order deleted",
      status: "200",
    });
  });
});

MongoClient.connect(mongoURL, (err, client) => {
  if (err) {
    console.log(err);
  }
  db = client.db("tataCliq");
});

app.listen(port, () => {
  console.log(`${port}`);
  console.log(`${mongoURL}`);
});
