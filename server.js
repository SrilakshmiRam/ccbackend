const express=require('express')
const {open}=require('sqlite')
const cors=require('cors')
const sqlite3=require('sqlite3')
const path=require('path')

const app=express()

const dbPath=path.join(__dirname,"ccdata.db")

app.use(cors({
    origin: 'http://localhost:3000', // Adjust to match your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

app.use(express.json())

let db=null

initiateAndStartDatabaseServer=async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(3000,()=>{
            console.log('Backend Server is running at htpp://localhost:3000/')
        })
    } catch (e) {
        console.log(`DB Error {e.message}`)
        process.exit(1)
    }
}

initiateAndStartDatabaseServer()


app.get("/mentors",async(req,res)=>{
   const mentirsQuery=`select * from mentors;`
   const response=await db.all(mentirsQuery)
   res.send(response)
})


app.get("/bookings",async(req,res)=>{
    const mentirsQuery=`select * from Bookings;`
    const response=await db.all(mentirsQuery)
    res.send(response)
 })

