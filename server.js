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

app.get("/api/add/:title", async (req, res) => {
  let title = req.params["title"]; // /api/add/<title>
  let code = req.query["code"]; // /api/add/<title>?code=<code>
  if (code.length < 2 || !title) {
    return res.status("400").send("Bad Request");
  }
  let length = await r
    .table(rethinkdb.table)
    .count()
    .run(global.conn);
  db.addFile({ code: code, title: title, id: length + 1 });
  res.redirect(`/file/${length + 1}`);
});

app.get("/file/:id", async (req, res) => {
  let id = req.params.id;
  let file = await r
    .table(rethinkdb.table)
    .filter({ id: parseInt(id) })
    .coerceTo("array")
    .run(global.conn);
  let code = file[0]["code"];
  let title = file[0]["title"];
});

app.get("*", (req, res) => {
  res.send("404");
});

app.listen(server.port, () => {
  console.log(`Server Ready!\nPort: ${server.port}`);
  db.init({ host: rethinkdb.host, port: rethinkdb.port });
});
