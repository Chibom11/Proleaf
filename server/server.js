import express from 'express'
import registerUserRoute from './routes/userroute.js'
import loginUserRoute from './routes/loginroute.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config({
    path:'.env'
})
const app=express()
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(express.json())




app.use('/api',registerUserRoute)
app.use('/api',loginUserRoute)

const port=5050
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

