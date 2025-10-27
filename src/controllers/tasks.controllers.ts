import type { Request, Response } from "express";
// import { initialTasks } from "../lib/constants";
//import type { Task } from "../lib/types";
import { Prisma } from "@prisma/client";
import type { Task } from "@prisma/client"; //generated from prisma, no longer needs my own

import prisma from "../lib/prisma";

//GET tasks
type GetTasksResponse = {
  message: string;
  tasks?: Task[];
};

export const getTasks = async (
  req: Request,
  res: Response<GetTasksResponse>
): Promise<void> => {
  try {
    const { userId } = req;
    if (!userId) {
      throw Error("No user ID found");
    }
    console.log("GET /tasks --> request received");
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
      },
    });
    console.log("Tasks fetched:", tasks);

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (err) {
    //If Promise fails → catch already runs. Nothing else is needed.
    //can abstract to an error middleware
    console.error("Error in GET /tasks: ", err);
    res
      .status(500)
      .json({ message: "SSE / Something went wrong gettin the tasks" });
  }
};

type PostTaskBody = {
  taskName: string;
};

type PostTasksResponse = {
  message: string;
  task?: Task;
};

//POST task
export const postTask = async (
  req: Request<{}, {}, PostTaskBody, {}>,
  res: Response<PostTasksResponse>
): Promise<void> => {
  console.log("POST /task --> request received");

  try {
    const { userId } = req;
    const { taskName } = req.body;

    if (!userId) {
      throw Error("No user ID found");
    }

    const taskCreated = await prisma.task.create({
      data: {
        name: taskName,
        userId: userId,
      },
    });
    console.log("Task created:", taskCreated);
    res.status(201).json({
      message: "Task created successfully",
      task: taskCreated,
    });
    //If Promise fails → catch already runs. Nothing else is needed.
  } catch (err) {
    console.error("Error in POST /task: ", err);
    res
      .status(500)
      .json({ message: "SSE / Something went wrong creating the task" });
  }
};

type deleteTaskParams = {
  id: string;
};

type deleteTaskResponse = {
  message: string;
  task?: Task;
};

//DELETE task
export const deleteTask = async (
  req: Request<deleteTaskParams, {}, {}, {}>,
  res: Response
) => {
  console.log("DELETE /task --> request received");
  const { id } = req.params;
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: JSON.parse(id),
      },
    });
    console.log("Task deleted:", deletedTask);
    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({
          message: `Task with id ${id} not found`,
        });
      }
    }
    console.error("Error in DELETE /task: ", err);
    res.status(500).json({ message: "Something went wrong deleting the task" });
  }
};

type PutTaskBody = {
  name?: string;
  isCompleted?: boolean;
};

type PutTaskParams = {
  id: string;
};

type PutTasksResponse = {
  message: string;
  task?: Task;
};

//TOGGLE task
export const updateTask = async (
  req: Request<PutTaskParams, {}, PutTaskBody, {}>,
  res: Response
) => {
  console.log("PUT / task --> request received");
  const { id } = req.params;

  // Build the update object safely
  let dataObjForUpdate: PutTaskBody = {};

  if ("isCompleted" in req.body) {
    const { isCompleted } = req.body;
    console.log(isCompleted);
    dataObjForUpdate = { isCompleted };
  }
  if (req.body.name) {
    const { name } = req.body;
    console.log(name);
    dataObjForUpdate = {
      name,
    };
  }

  console.log(id);

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: JSON.parse(id),
      },
      data: dataObjForUpdate,
    });
    console.log("Task updated:", updatedTask);
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({
          message: `Task with id ${id} not found`,
        });
      }
    }
    res.status(500).json({ message: "Something went wrong updating the task" });
  }
};

//GET specific task
