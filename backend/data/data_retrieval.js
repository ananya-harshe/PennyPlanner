import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), './backend/.env') });
const API_KEY = process.env.NESSIE;

fetch(`http://api.nessieisreal.com/customers?key=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    console.log("Customers:", data);
  })
  .catch(error => console.error('Error:', error));