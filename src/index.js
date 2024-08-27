import app from './app.js'; 
import { connectDB } from './db.js';

connectDB(); //connect to database 
app.listen(3000); //start server on port 3000
console.log('Server on port', 3000); //log message to console