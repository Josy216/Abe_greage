"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installTables = installTables;
// Import the query function from the dbConfig module
const path_1 = __importDefault(require("path"));
const db_config_1 = __importDefault(require("../config/db.config"));
const fs_1 = __importDefault(require("fs"));
// Create a function to install the database tables
async function installTables() {
    // Create a variable to hold the path to the sql file
    const queryPath = path_1.default.join(__dirname, '..', 'services', 'sql', 'initial-queries.sql');
    // Temporary variable, user to store all queries, the return message will be the last query
    let queries = [];
    let finalMessage = { message: '' };
    let templine = '';
    // Read the sql file
    const lines = await fs_1.default.readFileSync(queryPath, 'utf8').split('\n');
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
            await db_config_1.default.query(queries[i], []);
        }
        catch (error) {
            finalMessage.message = `Error executing query: ${queries[i]} - ${error.message}`;
            finalMessage.status = 500;
            break; // Stop on first error for clarity
        }
    }
    // Prepare the final message to return to the controller
    if (!finalMessage.message) {
        finalMessage.message = 'All tables are created successfully';
        finalMessage.status = 200;
    }
    else {
        finalMessage.status = 500;
    }
    return finalMessage;
}
