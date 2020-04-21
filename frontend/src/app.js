import React, { useState, Fragment, useEffect } from "react";
import TodoItem from "./TodoItem";
import { getTodos, addTodo, deleteTodo, updateTodo } from "./api/TodoApi";
import "./App.css";
const express = require('express')
const {
  getAllAccounts,
  createAccount,
  updateAccount,
  deleteAccount
} = require('./controller')

const app = express()
app.locals.dataFilePath = "./data.json"

const port = 5000

app.use(express.json())

app.get("/accounts", getAllAccounts)

app.post("/accounts", createAccount)

app.put("/accounts", updateAccount)

app.delete("/accounts/:id", deleteAccount)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

exports.app = app
