"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
// Use the routes
const index_1 = __importDefault(require("./routes/index"));
const cors_1 = __importDefault(require("cors"));
const sanitize_1 = __importDefault(require("sanitize"));
// Create a variable to store the port number
const PORT = process.env.PORT;
// Create an instance of express
const app = (0, express_1.default)();
// Use the routes
app.use(express_1.default.json());
// add cors
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
}));
// add senitize
app.use(sanitize_1.default.middleware);
// Use the routes
app.use(index_1.default);
// test the server
app.get('/', (req, res) => {
    res.send('Server is running');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Export the app to be used in other files
exports.default = app;
