import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface Contact {
    id?: number;
    name: string;
    email: string;
}

interface ContactFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (contact: Contact) => void;
    existingContacts: Contact[];
    contact: Contact | null;
    isEditMode: boolean;
}

function ContactForm({
    open,
    onClose,
    onSubmit,
    existingContacts = [],
    contact = null,
    isEditMode = false
}: ContactFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailExistError, setEmailExistError] = useState(false);
    const [nameError, setNameError] = useState(false);

    const EMAIL_REGEX = /^[^\s/,@]+@[^\s/,@]+\.[^\s/,.@]+$/;

    useEffect(() => {
        if (open) {
            setName(isEditMode && contact ? contact.name : '');
            setEmail(isEditMode && contact ? contact.email : '');
            setNameError(false);
            setEmailError(false);
            setEmailExistError(false);
        }
    }, [open, isEditMode, contact]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setNameError(e.target.value.trim() === "");
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        const emailExists = existingContacts.some(
            (existingContact) => existingContact.email === e.target.value && existingContact.id !== contact?.id
        );
        setEmailExistError(emailExists);
        const isEmailValid = EMAIL_REGEX.test(e.target.value);
        setEmailError(!isEmailValid && e.target.value !== "");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isNameError = name.trim() === "";
        const isEmailError = email.trim() === "" || !EMAIL_REGEX.test(email);
        const isEmailExistError = existingContacts.some(
            (existingContact) => existingContact.email === email && existingContact.id !== contact?.id
        );
        setNameError(isNameError);
        setEmailError(isEmailError);
        setEmailExistError(isEmailExistError);
        if (!isNameError && !isEmailError && !isEmailExistError) {
            onSubmit({ id: contact?.id, name, email });
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            {/* <DialogTitle align="center" fontSize="2.5vh" fontWeight="Bold">{isEditMode ? "Edit Contact" : "Add Contact"}</DialogTitle> */}
            <DialogContent>
                <TextField
                    label="Name"
                    value={name}
                    onChange={handleNameChange}
                    fullWidth
                    margin="normal"
                    required
                    error={nameError}
                    helperText={nameError ? "Name is required" : ""}
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                    error={emailError || emailExistError}
                    fullWidth
                    margin="normal"
                    required
                    type="email"
                    helperText={
                        emailExistError ? "Email already exists" :
                            (emailError ? "Please enter a valid email" : "")
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="outlined" color="primary">
                    {isEditMode ? "Save Update" : "Add New Contact"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ContactForm;