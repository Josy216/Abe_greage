import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
// Use the routes
import routes from './routes/index';
import cors from 'cors';
import sanitize from 'sanitize';

// Create a variable to store the port number
const PORT = process.env.PORT;

// Create an instance of express
const app = express();

// Use the routes
app.use(express.json());

// add cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
  })
);

// add senitize
app.use(sanitize.middleware);

// Use the routes
app.use(routes);

// test the server
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app to be used in other files
export default app;
