import type { Request, Response } from "express";
// import { initialTasks } from "../lib/constants";
//import type { Task } from "../lib/types";
import type { Task } from '@prisma/client'; //generated from prisma, no longer needs my own 

import prisma from "../lib/prisma";

//GET tasks

type GetTasksResponse = {
  message: string;
  tasks?: Task[];
};

export const getTasks = async (req: Request, res: Response<GetTasksResponse>):Promise<void> => {
  try{
    console.log("GET /tasks --> request received")
    const tasks = await prisma.task.findMany()
    console.log("Tasks fetched:", tasks)

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks
    })
  }
  //If Promise fails → catch already runs. Nothing else is needed.
  catch(err){
    //can abstract to an error middleware
    console.error("Error in GET /tasks: ", err)
    res.status(500).json({ message: "SSE / Something went wrong gettin the tasks" });
  }
};

type PostTaskBody={
  taskName:string
}

type PostTasksResponse = {
  message: string;
  task?: Task;
};

//POST task
export const postTask = async (req: Request<{},{}, PostTaskBody, {}>, res: Response<PostTasksResponse>):Promise<void> => {
  console.log("POST /task --> request received")

  try {
    const {taskName} = req.body
    const taskCreated = await prisma.task.create({data:{
      name: taskName
    }})
    console.log("Task created:", taskCreated)
    res.status(201).json({
      message: "Task created successfully",
      task: taskCreated
    })
  //If Promise fails → catch already runs. Nothing else is needed.

  }
  catch(err){
    console.error("Error in POST /task: ", err)
    res.status(500).json({ message: "SSE / Something went wrong creating the task" })
  }

};

type deleteTaskParams = {
  id: string
}

type deleteTaskResponse = {
  message: string;
  task?: Task;
}

//DELETE task
export const deleteTask = async (req: Request<deleteTaskParams, {}, {}, {}>, res: Response) => {
  console.log("DELETE /task --> request received")
  const {id} = req.params
  try{
    const deletedTask = await prisma.task.delete({
      where: {
        id: JSON.parse(id)
      }
    })
    console.log("Task deleted:", deletedTask)
    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask
    })
  }
  catch(err){
    console.error("Error in DELETE /task: ", err)
    res.status(500).json({message:"Something went wrong deleting the task"})
  }

};

//GET specific task

//TOGGLE task
