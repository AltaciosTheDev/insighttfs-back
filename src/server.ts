import express, { type Request, type Response } from "express"
import cors from "cors"
//import { tasksRouter } from "./routes/tasks.routes.js"
import "dotenv/config"


//initialize app
const app = express()

//express middleware
app.use(cors())
app.use(express.json())



//Tasks Router
//app.use("/api/tasks", tasksRouter)

//not found 404
app.use((req:Request, res:Response<{message:string}>):void => {
  res.json({message: "Route not found 404"})
})

//server listening 
app.listen(3000, () => {
  console.log("server running on port 3000")
})
