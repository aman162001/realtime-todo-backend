const express = require("express");
const app = express();
const connect = require("./db/connect");
const authRouter = require("./routes/auth");
const cors = require("cors");
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const httpServer = require("http").createServer(app);
const rootSocket = require("./socket/root-socket");
require("dotenv").config();
const port = process.env.PORT || 8080;
const jwt = require("jsonwebtoken");

app.use(cors());

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


const io = new Server(httpServer, {
  cors: {
    origin: "*",
    allowedHeaders: ["Authorization"],
  },
});

/* ---Middleware for socket connection--- */
io.use((socket, next) => {
  jwt.verify(
    socket.handshake.auth.token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (decoded) {
        next();
      } else {
        next("Unauthorized");
      }
    }
  );
});

rootSocket(io);

/* ---API-Routes ---*/
app.get("/", (req, res) => {
  res.send("Todo backend");
});
app.use(authRouter);

const start = () => {
  connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log("ERROR:" + err);
    });

  httpServer.listen(port, () => {
    console.log("Server started..");
  });
};

start();
