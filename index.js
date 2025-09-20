import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import cors from "cors";
import { type } from "os";

const app = express();
const upload = multer();

//inisialisasi model AI
const geminiModels = {
    text: "gemini-2.5-flash-lite",
    image: "gemini-2.5-flash",
    audio: "gemini-2.5-flash",
    document: "gemini-2.5-flash-lite",
};

//inisialisasi aplikasi back-end/sesrver
app.use(cors()); //use() panggil/bikin middleware
app.use(express.json()); //membolehkan kita menggunakan Content-Type: application/json di header

//inisialisasi route
app.post('/generate-text', async (req, res) => {
    //handle bagaimana request diterima user
    const { body } = req; //object destructuring

    //guard clause -> satpam utk melihat case2 negatif
    if (!body) {
        //jika body tidak ada isinya
        res.status(400).json({ message: "Tidak ada payload yang dikirim" });
        return;
    }

    //req.body = [] //typeof -> object; Array.isArray() //true
    //req.body = {} //typeof -> object; Array.isArray() //false
    if (typeof body !== 'object') {
        res.status(400).json({ message: "Type payload tidak sesuai" })
        return;
    }

    const { message } = body;
    if (!message || typeof message !== 'string') {
        res.status(400).json({ message: "Pesan tidak ada, atau format pesan tidak sesuai" });
        return;
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: geminiModels.text
    });

    res.status(200).json({
        message: response.text
    });
});

/*async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
}

await main();*/

const port = 3000;

app.listen(port, () => {
    console.log("SERVER RUNNING on PORT: ", port);
});