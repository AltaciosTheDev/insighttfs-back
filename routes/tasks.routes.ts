import express, { Router } from "express"
import { postTask, deleteTask, getTasks } from "../controllers/tasks.controllers.js"

export const tasksRouter:Router = express.Router()

//GET tasks
tasksRouter.get("/", getTasks)
//POST task
tasksRouter.post("/", postTask)
//DELETE task  
tasksRouter.delete("/:id", deleteTask)

