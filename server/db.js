import {Pool} from 'pg'
import dotenv from 'dotenv'
dotenv.config({
    path:'.env'
})
const pool = new Pool({
  user: 'postgres',         
  host: 'localhost',
  database: process.env.DB_NAME,      
  password: process.env.POSTGRES_PASSWORD, 
  port: 5432,
});
export default pool