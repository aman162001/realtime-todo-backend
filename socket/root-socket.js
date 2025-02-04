const {
  addTodo,
  getTodo,
  deleteTodo,
  todoComplete,
} = require("../controllers/todo");
const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.on("connection", (socket) => {
    const user = jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET
    );

    getTodo(socket, user);

    socket.on("test", (e) => {
      console.log("test");
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("addItem", (data) => {
      addTodo(user, data).then((resp) => {
        io.emit("itemAdded", resp);
      });
    });

    socket.on("completedItem", (data) => {
      todoComplete(user, data).then((resp) => {
        io.emit("todoComplete", resp);
      });
    });

    socket.on("deleteItem", (id) => {
      deleteTodo(user, id).then((resp) => {
        console.log(resp);
        io.emit("itemDeleted", resp);
      });
    });
  });
};
