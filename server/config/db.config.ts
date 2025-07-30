// Import the mysql2 module Promise Wrapper
import mysql from 'mysql2/promise';

// Prepare static connection parameters to connect to the database
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  connectionLimit: 10,
};

// Create a connection pool to the database
const pool = mysql.createPool(dbConfig);

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Database connected successfully!');
    conn.release();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();

// Prepare a function that will execute a query asynchronously
async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Export the query function to be used in other files
export default { query };
