let r = require("rethinkdb");
let { server, rethinkdb } = require("./config.json");

let express = require("express");
let app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

r.connect({ host: rethinkdb.host, port: rethinkdb.port }, (err, conn) => {
  if (err) return console.error(err);
  console.log("Connected to database");
  global.conn = conn;
});

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("*", (req, res) => {
  res.send("404");
});

app.listen(server.port, () => {
  console.log(`Server Ready!\nPort: ${server.port}`);
});
