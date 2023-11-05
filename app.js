const express = require("express");
const mysql = require("mysql");
const app = express();

// Database configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "your_mysql_user",
  password: "your_mysql_password",
  database: "blogging_db",
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Set up middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  // Fetch and display the list of blogs from the database
  db.query("SELECT * FROM blogs", (err, blogs) => {
    if (err) throw err;
    res.render("home", { blogs });
  });
});

app.get("/blog/:id", (req, res) => {
  const blogId = req.params.id;
  // Fetch the selected blog and its comments from the database
  db.query("SELECT * FROM blogs WHERE id = ?", [blogId], (err, blog) => {
    if (err) throw err;
    db.query(
      "SELECT * FROM comments WHERE blog_id = ?",
      [blogId],
      (err, comments) => {
        if (err) throw err;
        res.render("blog", { blog: blog[0], comments });
      }
    );
  });
});

app.post("/comment/:id", (req, res) => {
  const blogId = req.params.id;
  const comment = req.body.comment;
  // Insert the comment into the database
  db.query(
    "INSERT INTO comments (blog_id, text) VALUES (?, ?)",
    [blogId, comment],
    (err) => {
      if (err) throw err;
      res.redirect(`/blog/${blogId}`);
    }
  );
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
