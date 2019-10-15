//PORT HERE

let port = 80;

//PORT HERE




const express = require("express"),
  app = express();
let linter = require("eslint").linter;
const http = require("http");
let fs = require("fs");
let data = "";
let views = __dirname + "/views/";
app.use("/files", express.static("public"));
app.set("view engine", "ejs");
var redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
const listener = app.listen(port, function() {
  console.log("DONE | " + port);
});
/*setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);*/
//Strona główna
app.get("/", (req /* request */, res /* response */) => {
  let cos = ""
  let ever = require('fs')
    .readdirSync(__dirname + '/data/')
    .map(file => require(`${__dirname}/data/${file}`));
  if(ever.length < 5) cos = "pliki";
  else cos = "plików"
  res.status(200).render(views + "index.ejs",{pliki: `Mamy już ${ever.length} ${cos}`});
});
app.get("/files/:id", (req, res) => {
  let id = req.params.id;
  try {
    data = fs.readFileSync(`./data/${id}.json`);
  } catch (err) {
    return res.status(404).sendFile(views + "/notfound.html");
  }
  data = JSON.parse(data);
  let errors = "";
  if(data["roz"] == "js"){
    var messages = linter.verify(data["content"], {
      rules: {
        semi: 0
      }
    } , { filename: "foo.js" });
    for(let i=0; i<messages.length; i++){
      errors += "Error: " + messages[i]["line"] + ":" + messages[i]["column"] + " | " + messages[i]["message"] + "\n"
    }
  }
  res.status(200).render(views + "files.ejs", {
    content: data["content"],
    title: data["title"],
    roz: data["roz"],
    errors: errors
  });
});
app.get("/folders/:id", (req,res) =>{
  let id = req.params.id;
  try {
    data = require(__dirname + `/folders/${id}/index.js`)
  } catch (err) {
    return res.status(404).sendFile(views + "/notfound.html");
  }
  res.status(200).render(views + "folders.ejs", {
    files: data[0].fata,
    title: data[1]
  });
})
app.get("/folders/:id/:file", (req, res) => {
  let id = req.params.id;
  let file = req.params.file;
  try {
    data = require(__dirname + `/folders/${id}/files/${file}`)
  } catch (err) {
    return res.status(404).sendFile(views + "/notfound.html");
  }
  res.status(200).render(views + "files.ejs", {
    content: data["content"],
    title: data["title"],
    roz: data["roz"],
    errors: ""
  });
})
app.get("/send", (req, res) => {
  res.sendFile(views + "/send.html");
});
app.get("/create", (req,res) =>{
  res.sendFile(views + "/create.html")
})

app.use(error404);
function error404(req, res, next) {
  res.status(404).sendFile(views + "/notfound.html");
}
let io = require("socket.io")(listener);

io.on("connection", function(socket) {
  console.log(socket.id);
  socket.on("savedata", function(data) {
    if (data.code.length < 3) return;
    if (data.title.length < 1) return;
    let data2 = {
      title: data.title,
      content: data.code,
      roz: data.lang
    };
    fs.exists(__dirname + "/data/" + data.id + ".json", function(ex) {
      if (ex == true) return;
      else {
        fs.writeFile(
          `./data/${data.id}.json`,
          JSON.stringify(data2, null, 4),
          err => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("File created | " + data.id);
          }
        );
      }
    });
  });
  socket.on("end", function() {
    socket.disconnect(0);
  });
});
