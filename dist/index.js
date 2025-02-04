"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    // Send a response to the client
    res.send('Hello, TypeScript + Node.js + Express!');
});
const port = "6001";
app.listen(port, () => {
    console.log(`Server running on PORT - ${port}`);
});
