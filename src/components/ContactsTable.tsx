import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';

interface Contact {
    id?: number;
    name: string;
    email: string;
}

interface ContactsTableProps {
    contacts: Contact[];
    onEdit: (contact: Contact) => void;
    onDelete: (id: number) => void;
}

function ContactsTable({ contacts, onEdit, onDelete }: ContactsTableProps) {
    return contacts.length > 0 ? (
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: "50vh", borderRadius: 4 }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow >
                        <TableCell sx={{ width: "8vw", fontWeight: "bold" }}>Name</TableCell>
                        <TableCell sx={{ width: "11vw", fontWeight: "bold" }}>Email</TableCell>
                        <TableCell align="center" colSpan={1} sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                            <TableCell>{contact.name}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <IconButton onClick={() => onEdit(contact)} size="small">
                                    <EditNoteRoundedIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={() => contact.id !== undefined ? onDelete(contact.id) : null} size="small">
                                    <PersonRemoveRoundedIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    ) : (
        <Typography color='#828282' marginTop="3vh">
            No contacts available.</Typography>
    );
}

export default ContactsTable;