import { Box, Button, IconButton, TextField, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InputMask from 'react-input-mask';
import { ContactType, EnumLabels, ContactPatterns, ValidationPatterns } from '../../../components/shared/enums';
import { ContactResource } from '../api/api-types';
import { Label } from '@mui/icons-material';


interface ContactSectionProps {
  contacts: ContactResource[];
  onChange: (contacts: ContactResource[]) => void;
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

  const handleContactChange = (index: number, field: keyof ContactResource, value: any) => {
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
          {
          contact.mandatory?
          (
            <TextField
            disabled
            value={EnumLabels.ContactType[contact.type] }
            sx={{ minWidth: 200 }}
          />
          ):
          (<Select
            value={contact.type}
            onChange={(e) => handleContactChange(index, 'type', e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {Object.values(ContactType).map((type) => (
              <MenuItem key={type} value={type}>
                {EnumLabels.ContactType[type]}
              </MenuItem>
            ))}
          </Select>)
          }

          {ContactPatterns[contact.type] === 'email' ? (
            <TextField
              required
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

          {contact.mandatory?
          (<IconButton 
            color="error"
            disabled
          >
            <DeleteIcon />
          </IconButton>):
          (<IconButton 
            color="error"
            onClick={() => handleRemoveContact(index)}
          >
            <DeleteIcon />
          </IconButton>)
}
        </Box>
      ))}
    </Box>
  );
} 