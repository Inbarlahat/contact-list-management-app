import { useState, useEffect, useCallback } from "react";
import { Container, Typography, Button } from "@mui/material";
import { Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContactForm from "./components/ContactForm";
import ContactsTable from "./components/ContactsTable";
import axios from "axios";

interface Contact {
    id?: number;
    name: string;
    email: string;
}

interface AlertState {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}

const PORT = 5001;

function App() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [alert, setAlert] = useState<AlertState>({ open: false, message: '', severity: 'success' });
    const [showContacts, setShowContacts] = useState(false);

    const address = `http://localhost:${PORT}/api/contacts`;

    const fetchContacts = useCallback(async () => {
        const response = await axios.get<Contact[]>(address);
        setContacts(response.data);
    }, [address]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const addContact = async (contact: Contact) => {
        await axios.post(address, contact);
        fetchContacts();
        setAlert({ open: true, message: `Contact ${contact.name} added successfully!`, severity: 'success' });
    };

    const updateContact = async (contact: Contact) => {
        if (!contact || !contact.id) {
            console.error("the contact object is missing or undefined");
            return;
        }
        await axios.put(`${address}/${contact.id}`, contact);
        fetchContacts();
        setAlert({ open: true, message: `Contact ${contact.name} updated successfully!`, severity: 'info' });
    };

    const deleteContact = async (id: number) => {
        await axios.delete(`${address}/${id}`);
        fetchContacts();
        setAlert({ open: true, message: `Contact deleted successfully!`, severity: 'error' });
    };

    const handleAddContactClick = () => {
        setIsEditMode(false);
        setSelectedContact(null);
        setOpenForm(true);
    };

    const handleEditContactClick = (contact: Contact) => {
        setIsEditMode(true);
        setSelectedContact(contact);
        setOpenForm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setSelectedContact(null);
    };

    const handleFormSubmit = (contact: Contact) => {
        if (isEditMode) {
            updateContact(contact);
        } else {
            addContact(contact);
        }
        handleFormClose();
    };

    const toggleContactsTable = () => {
        setShowContacts(prev => !prev);
    };

    return (
        <div style={{
            background: 'linear-gradient(to bottom right, #0066ff, #99ccff)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: "column",
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Typography color="white"
                noWrap={false}
                variant="h4"
                gutterBottom
                sx={{
                    fontFamily: "Courier, monospace",
                    fontWeight: "Bold",
                    marginTop: "2vh",
                    letterSpacing: "0.5rem",
                    textShadow: '1px 1px 2px #99ccff, 0 0 1em #0B50AD, 0 0 0.2em #0B50AD'
                }}>
                CONTACT LIST
            </Typography>
            <Container maxWidth="sm" sx={{
                background: "rgba(255, 255, 255, 1)",
                borderRadius: 4,
                padding: "2rem",
                width: "80%",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", marginBottom: "5vh", height: "80vh", overflow: "scroll"
            }}>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddContactClick}
                    startIcon={<AddIcon />}
                    sx={{ marginBottom: "2vh", background: "#3287fb" }}
                >
                    Add Contact
                </Button>
                <Button onClick={toggleContactsTable} variant="outlined" color="primary" sx={{ marginBottom: "3vh" }}
                >
                    {showContacts ? 'Hide Contact List' : 'View Contact List'}
                </Button>
                {showContacts && (
                    <div>
                        <ContactsTable
                            contacts={contacts}
                            onEdit={handleEditContactClick}
                            onDelete={deleteContact}
                        />    </div>
                )}
                <ContactForm
                    open={openForm}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                    existingContacts={contacts}
                    contact={selectedContact}
                    isEditMode={isEditMode}
                />
                <Snackbar
                    open={alert.open}
                    autoHideDuration={3000}
                    onClose={() => setAlert({ ...alert, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    );
}

export default App;