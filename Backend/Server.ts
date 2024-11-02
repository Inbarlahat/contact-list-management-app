import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

interface Contact {
    id?: number;
    name: string;
    email: string;
}

let contacts: Contact[] = [];
let nextId = 1;

app.get('/api/contacts', (req: Request, res: Response) => {
    res.json(contacts);
});

app.post('/api/contacts', (req: Request, res: Response) => {
    const newContact: Contact = { id: nextId++, name: req.body.name, email: req.body.email };
    contacts.push(newContact);
    res.status(201).json(newContact);
});

app.get('/api/contacts/:id', (req: Request, res: Response) => {
    const contact = contacts.find(c => c.id === Number(req.params.id));
    if (!contact) return res.status(404).send('Contact not found');
    res.json(contact);
});

app.put('/api/contacts/:id', (req: Request, res: Response) => {
    const contact = contacts.find(c => c.id === Number(req.params.id));
    if (!contact) return res.status(404).send('Contact not found');
    contact.name = req.body.name as string;
    contact.email = req.body.email as string;
    res.json(contact);
});

app.delete('/api/contacts/:id', (req: Request, res: Response) => {
    const index = contacts.findIndex(c => c.id === Number(req.params.id));
    if (index === -1) return res.status(404).send('Contact not found');
    contacts.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}).on('error', (err: Error) => {
    console.error('Error starting server:', err.message);
});