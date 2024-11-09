import { Box, Button, IconButton, TextField, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InputMask from 'react-input-mask';
import { ContactType, EnumLabels, ContactPatterns, ValidationPatterns } from '../shared/enums';

interface Contact {
  type: ContactType;
  value: string | null;
}

interface ContactSectionProps {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}

export function ContactSection({ contacts, onChange }: ContactSectionProps) {
  const handleAddContact = () => {
    onChange([
      ...contacts,
      { type: ContactType.PERSONAL_CELL_PHONE, value: '' }
    ]);
  };

  const handleRemoveContact = (index: number) => {
    onChange(contacts.filter((_, i) => i !== index));
  };

  const handleContactChange = (index: number, field: keyof Contact, value: any) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    onChange(newContacts);
  };

  const getContactMask = (type: ContactType) => {
    if (ContactPatterns[type] === 'email') {
      return '';
    }
    return ContactPatterns[type];
  };

  const validateContact = (type: ContactType, value: string) => {
    if (ContactPatterns[type] === 'email') {
      return ValidationPatterns.email.test(value);
    }
    return true;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddContact}
        >
          Adicionar Contato
        </Button>
      </Box>

      {contacts.map((contact, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Select
            value={contact.type}
            onChange={(e) => handleContactChange(index, 'type', e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {Object.values(ContactType).map((type) => (
              <MenuItem key={type} value={type}>
                {EnumLabels.ContactType[type]}
              </MenuItem>
            ))}
          </Select>

          {ContactPatterns[contact.type] === 'email' ? (
            <TextField
              fullWidth
              type="email"
              value={contact.value || ''}
              onChange={(e) => handleContactChange(index, 'value', e.target.value)}
              error={contact.value ? !validateContact(contact.type, contact.value) : false}
              helperText={contact.value && !validateContact(contact.type, contact.value) ? 'Email inválido' : ''}
            />
          ) : (
            <InputMask
              mask={getContactMask(contact.type)}
              value={contact.value || ''}
              onChange={(e) => handleContactChange(index, 'value', e.target.value)}
            >
              {(inputProps: any) => (
                <TextField
                  {...inputProps}
                  fullWidth
                />
              )}
            </InputMask>
          )}

          <IconButton 
            color="error"
            onClick={() => handleRemoveContact(index)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
} 