const User = require("../model/User");
const mongoose = require("mongoose");

const addTodo = async (user, todo) => {
  const update = await User.findOneAndUpdate(
    { email: user.email },
    { $push: { todo: { task: todo.task, is_done: todo.is_done } } }
  );
  return update.todo;
};

const deleteTodo = async (user, id) => {
  const update = await User.findOneAndUpdate(
    { email: user.email },
    { $pull: { todo: { _id: id } } }
  );
  return { id: id };
};

const todoComplete = async (user, data) => {
  const _user = await User.findOne({ email: user.email });
  let arr = _user.todo;
  let idx = arr.findIndex((item) => item._id == data.id);
  arr[idx].is_done = data.is_done;

  User.updateOne({ email: user.email }, { todo: arr }, (err, obj) => {
    if (err) throw err;
  });

  return { id: data.id, is_done: data.is_done };
};

const getTodo = async (socket, user) => {
  const todo = await User.findOne({ email: user.email });
  return socket.emit("initialData", todo.todo);
};

module.exports = { addTodo, getTodo, deleteTodo, todoComplete };
