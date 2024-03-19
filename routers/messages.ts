import express from 'express';
import { Message } from '../types';
import {promises as fs} from 'fs';

const path = 'messages';
const messagesRouter = express.Router();

messagesRouter.post('/', async (req, res) => {
    const datetime = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${datetime}.txt`;
    const filePath = `${path}/${fileName}`;
    const message: Message = {...req.body, datetime};

    try {
        fs.writeFile(filePath, JSON.stringify(message));
        res.json(message);
    } catch (err) {
        console.error(err);
    }
});

messagesRouter.get('/', async (req, res) => {
    try {
        const files = await fs.readdir(path);
        const lastFiles = files.slice(-5);
        const messages: Message[] = [];
        for (const file of lastFiles) {
            const data = await fs.readFile(`${path}/${file}`, 'utf8');
            messages.push(JSON.parse(data));
        }

        res.json(messages)
    } catch {
        res.status(404).json({ error: 'Not Found' });
    }
});

export default messagesRouter;