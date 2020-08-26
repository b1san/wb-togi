import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import expressWs from "express-ws";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const path = "./api/data/data.json";

const postData = (req) => {
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const body = req.body;
  const index = data.findIndex(e => e.code === body.code);
  return [data, body, index];
};

app.get("/member", (req, res) => {
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  res.send(data);
});

app.get("/member/:code", (req, res) => {
  const code = req.params.code;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const index = data.findIndex(e => e.code === code);
  if (index >= 0) {
    res.send(data[index]);
  } else {
    res.send(null);
  }
});

app.post("/member", (req, res) => {
  const [data, body, index] = postData(req);
  if (index >= 0) {
    data[index].name = body.name;
    data[index].kana = body.kana;
    data[index].roma = body.roma;
    data[index].tel  = body.tel;
    data[index].mail = body.mail;
    data[index].exte = body.exte;
    fs.writeFileSync(path, JSON.stringify(data));
  } 
  res.send();
});

app.put("/member", (req, res) => {
  const [data, body, index] = postData(req);
  if (index >= 0) {
    res.sendStatus(409);
    return;
  }
  data.push(body);
  fs.writeFileSync(path, JSON.stringify(data));
  res.send();
})

app.delete("/member/:code", (req, res) => {
  const code = req.params.code;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const index = data.findIndex(e => e.code === code);
  data.splice(index, 1);
  fs.writeFileSync(path, JSON.stringify(data));
  res.send();
})

app.post("/status", (req, res) => {
  const [data, body, index] = postData(req);
  data[index].status = body.status;
  data[index].comm = body.comm;
  fs.writeFileSync(path, JSON.stringify(data));
  res.send();
});

app.put("/memo", (req, res) => {
  const [data, body, index] = postData(req);
  data[index].memo.push(body.memo);
  fs.writeFileSync(path, JSON.stringify(data));
  res.send();
});

app.delete("/memo", (req, res) => {
  const [data, body, index] = postData(req);
  data[index].memo.splice(body.index, 1);
  fs.writeFileSync(path, JSON.stringify(data));
  res.send();
});

app.post("/seat", (req, res) => {
  const [data, body, index] = postData(req);
  data[index].seat = body.seat;
  fs.writeFileSync(path, JSON.stringify(data));
  res.send();
});

let connections = [];
expressWs(app);
const router = express.Router();
router.ws("/", (ws, req) => {
  connections.push(ws);
  ws.on('message', (msg) => {
    connections.forEach(conn => {
      const data = fs.readFileSync(path, 'utf8');
      conn.send(data);
    });
  });
  ws.on('close', () => {
    connections = connections.filter(conn => {
      return (conn === ws) ? false : true;
    })
  });
});
app.use("/ws", router);
app.listen(4000);

module.exports = {
  path: "/api/",
  handler: app
};