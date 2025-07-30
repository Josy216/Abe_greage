"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
// Import the install service to handler communication with the database
const install_service_1 = require("../services/install.service");
// Create a function service to create the database tables
async function install(req, res) {
    try {
        const instalMessage = await (0, install_service_1.installTables)();
        // check if the install was successful or not and send the appropriate message to the client
        if (instalMessage.status === 200) {
            res.status(200).json({ message: instalMessage });
        }
        else {
            res.status(500).json({ message: instalMessage });
        }
    }
    catch (error) {
        console.error('Error creating tables:', error);
        res.status(500).json({ message: 'Error creating tables', error: error });
    }
}
