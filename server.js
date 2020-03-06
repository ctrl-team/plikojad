let r = require("rethinkdb");
let { server, rethinkdb } = require("./config.json");

let express = require("express");
let app = express();

let db = require("./db/");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.get("/add", (req, res) => {
  res.sendFile(`${__dirname}/views/addFile.html`);
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

app.get("/api/file/:id", async (req, res) => {
  let id = req.params.id;
  let file = await r
    .table(rethinkdb.table)
    .filter({ id: parseInt(id) })
    .coerceTo("array")
    .run(global.conn);
  if (!file[0]) return res.redirect("/");
  let code = file[0]["code"];
  let title = file[0]["title"];
  res.json({ title: title, code: code.replace(/<br\/>/gm, "\n") });
});

app.get("/file/:id", async (req, res) => {
  let id = req.params.id;
  let file = await r
    .table(rethinkdb.table)
    .filter({ id: parseInt(id) })
    .coerceTo("array")
    .run(global.conn);
  if (!file[0]) return res.redirect("/");
  let code = file[0]["code"];
  let title = file[0]["title"];
  res.send("ok");
  //res.render(`${__dirname}/views/display.ejs`, { title: title, code: code });
});

app.get("*", (req, res) => {
  return res.redirect("/");
});

app.listen(server.port, () => {
  console.log(`Server Ready!\nPort: ${server.port}`);
  db.init({ host: rethinkdb.host, port: rethinkdb.port });
});
