// Import the query function from the dbConfig module
import path from 'path';
import query from '../config/db.config';
import fs from 'fs';

// Create a function to install the database tables
async function installTables() {
  // Create a variable to hold the path to the sql file
  const queryPath = path.join(
    __dirname,
    '..',
    'services',
    'sql',
    'initial-queries.sql'
  );
  // Temporary variable, user to store all queries, the return message will be the last query
  let queries: string[] = [];
  let finalMessage: { message: string; status?: number } = { message: '' };
  let templine = '';
  // Read the sql file
  const lines = await fs.readFileSync(queryPath, 'utf8').split('\n');

  // Create a promise to handle the asynchronous reading of the file and of the queries in the variables
  const execute = await new Promise((resolve, reject) => {
    // Iterate over all lines
    lines.forEach((line) => {
      // Check if the line is a comment
      if (line.trim().startsWith('--') || line.trim() === '') {
        return;
      }
      // Add the line to the temporary variable, if the line ends with a semicolon, execute the query
      templine += line;
      if (line.trim().endsWith(';')) {
        queries.push(templine);
        templine = '';
      }
    });
    resolve('All queries executed successfully');
  });

  // Execute the queries
  for (let i = 0; i < queries.length; i++) {
    try {
      await query.query(queries[i], []);
    } catch (error: any) {
      finalMessage.message = `Error executing query: ${queries[i]} - ${error.message}`;
      finalMessage.status = 500;
      break; // Stop on first error for clarity
    }
  }

  // Prepare the final message to return to the controller
  if (!finalMessage.message) {
    finalMessage.message = 'All tables are created successfully';
    finalMessage.status = 200;
  } else {
    finalMessage.status = 500;
  }
  return finalMessage;
}

// Export the installTables function
export { installTables };
