const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const rooms = new Map();

app.use(express.json());
app.use(express.urlencoded({ extented: true }));
app.use(cors());

app.get("/rooms/:id", (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [
          ...rooms
            .get(roomId)
            .get("users")
            .values()
        ],
        messages: [
          ...rooms
            .get(roomId)
            .get("messages")
            .values()
        ]
      }
    : { users: [], messages: [] };
  console.log(rooms, "AAAAAAA!!!!");

  res.json(obj);
});

app.post("/rooms", (req, res) => {
  const { roomId, userName } = req.body;

  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []]
      ])
    );
  }

  res.json([...rooms.keys()]);
});

io.on("connection", socket => {
  socket.on("ROOM:JOIN", ({ roomId, userName }) => {
    socket.join(roomId);
    rooms
      .get(roomId)
      .get("users")
      .set(socket.id, userName);

    const users = [
      ...rooms
        .get(roomId)
        .get("users")
        .values()
    ];
    socket.to(roomId).broadcast.emit("ROOM:SET_USERS", users);
  });

  socket.on("ROOM:NEW_MESSAGE", ({ roomId, userName, text }) => {
    const obj = {
      userName,
      text
    };
    rooms
      .get(roomId)
      .get("messages")
      .push(obj);
    socket.to(roomId).broadcast.emit("ROOM:NEW_MESSAGE", obj);
  });

  console.log("socket connected", socket.id);
  socket.on("disconnect", () => {
    rooms.forEach((value, roomId) => {
      console.log(value, roomId);
      console.log("aaaaaaa");

      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        socket.to(roomId).broadcast.emit("ROOM:SET_USERS", users);
      }
    });
  });
});

server.listen(9999, err => {
  if (err) {
    throw Error(err);
  }
  console.log("Сервер запущен!");
});
