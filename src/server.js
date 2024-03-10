import express from "express";

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("Server HaUI Food is running 🎉");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
