let r = require("rethinkdb");
let { server, rethinkdb } = require("./config.json");

let express = require("express");
let app = express();

let db = require("./db/");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("*", (req, res) => {
  res.send("404");
});

app.listen(server.port, () => {
  console.log(`Server Ready!\nPort: ${server.port}`);
  db.init({ host: rethinkdb.host, port: rethinkdb.port });
});
