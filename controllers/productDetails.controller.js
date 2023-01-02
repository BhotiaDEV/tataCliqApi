let express = require("express");
let productDetails = express();

// products based on category
productDetails.get("/:productId", (req, res) => {
  let productId = Number(req.params.productId);
  db.collection("productdata")
    .find({ product_id: productId })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// filter products based on product type , brands , price and discount
productDetails.get("/filter/:categoryId", (req, res) => {
  let categoryId = Number(req.params.categoryId);
  let lcost = Number(req.query.lcost);
  let hcost = Number(req.query.hcost);
  let mindiscount = Number(req.query.mindiscount);
  let maxdiscount = Number(req.query.maxdiscount);
  let brandId = Number(req.query.brandId);
  let query = {};

  if (brandId && lcost && hcost) {
    query = {
      category_id: categoryId,
      brand_id: brandId,
      $and: [{ price: { $gt: lcost, $lt: hcost } }],
    };
  } else if (lcost && hcost) {
    query = {
      category_id: categoryId,
      $and: [{ price: { $gt: lcost, $lt: hcost } }],
    };
  } else if (mindiscount && maxdiscount) {
    query = { discount: { $gt: mindiscount, $lt: maxdiscount } };
  } else if (mindiscount) {
    query = { discount: { $gt: mindiscount } };
  } else if (brandId) {
    query = {
      category_id: categoryId,
      brand_id: brandId,
    };
  } else {
    query = {
      category_id: categoryId,
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
productDetails.get("/details/:id", (req, res) => {
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
productDetails.post("/placeOrder", (req, res) => {
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
productDetails.get("/orders/:email", (req, res) => {
  let email = req.params.email;
  db.collection("orderdata")
    .find({ email })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// update payment details
productDetails.put("/updateOrder", (req, res) => {
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
productDetails.delete("/deleteOrder", (req, res) => {
  let _id = mongo.ObjectId(req.query.id);
  db.collection("orderdata").remove({ _id }, (err, result) => {
    if (err) throw err;
    res.send({
      message: "order deleted",
      status: "200",
    });
  });
});

module.exports = productDetails;
