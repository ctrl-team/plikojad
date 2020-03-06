let r = require("rethinkdb");
let { server, rethinkdb } = require("./config.json");

let express = require("express");
let app = express();

let db = require("./db/");
let bodyParser = require("body-parser");

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/api/add", async (req, res) => {
  let body = req["body"];
  if (!body["code"] || !body["title"]) {
    return res.status("400").send("Bad Request");
  }
  let length = await r
    .table(rethinkdb.table)
    .count()
    .run(global.conn);
  db.addFile({ code: body["code"], title: body["title"], id: length + 1 });
  res.status("200").send("OK");
});

app.get("*", (req, res) => {
  res.send("404");
});

app.listen(server.port, () => {
  console.log(`Server Ready!\nPort: ${server.port}`);
  db.init({ host: rethinkdb.host, port: rethinkdb.port });
});
