require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan=require("morgan");
const app = express();
app.use(morgan("dev"));
const Article = require("./models/Article");
// const Product = require("./models/Product"); // Import Product model
const verifyJwt = require("./middleware/verifyJwt");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(cookieParser());
app.use(express.json());
app.use("/auth", require("./routes/Auth.routes"));


app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("db is connected successfully"))
  .catch((err) => console.log("error is : " + err));
// Temporary Product Endpoint for Testing
// app.post("/products", async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(201).json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// app.get("/products", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

app.get("/hellow", (req, res) => {
  res.send("hellow mohamed");
});
app.get("/hi", (req, res) => {
  res.send("hiiiiiiiiiiiiiiiiii");
});

app.get("/findSummation/:number1/:number2", (req, res) => {
  const num1 = Number(req.params.number1);
  const num2 = Number(req.params.number2);
  const total = num1 + num2;
  res.send(`the number is: ${total} `);
});

app.get("/sayHallow", (req, res) => {
  res.send(`hallow ${req.body.name} , your age is ${req.query.age}`);
});

app.get("/numbers", (req, res) => {
  let numbers = "";
  for (let i = 0; i <= 100; i++) {
    numbers += i + "-";
  }
  res.send(`numbers are : ${numbers}`);
});
app.get("/getbackendbypath", (req, res) => {
  res.render("getbackendbypath.ejs", {
    name: "mohamed",
  });
});
//article endpoint
//add
app.post("/article", async (req, res) => {
  const newArticle = await Article.create(req.body);
  res.json(newArticle);
});
//edit
app.put("/article/:id", async (req, res) => {
  const newArticle = await Article.findByIdAndUpdate(req.params.id, req.body);
  res.json(newArticle);
});
//delete
app.delete("/article/:id", async (req, res) => {
  const newArticle = await Article.findByIdAndDelete(req.params.id);
  res.json(newArticle);
});
//get
//verifyJwt
app.get("/article", async (req, res)=> {
  try {
    // 1- جلب الـ query params
    const { search, page = 1, limit = 10 } = req.query;

    // 2- ابني query ديناميكي
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ];
    }

    // 3- Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 4- جلب البيانات
    const articles = await Article.find(query)
    .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // 5- العدد الكلي للـ frontend
    const total = await Article.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      articles,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(__dirname + "/views/404.html");
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
