import { Box, Button, IconButton, TextField, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DocumentType, EnumLabels, DocumentPatterns } from '../../../components/shared/enums';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputMask from 'react-input-mask';

interface PersonalDocument {
  type: DocumentType;
  value: string | null;
  issuingDate: string | null;
  issuingAgency: string | null;
}

interface DocumentSectionProps {
  documents: PersonalDocument[];
  onChange: (documents: PersonalDocument[]) => void;
}

export function DocumentSection({ documents, onChange }: DocumentSectionProps) {
  const handleAddDocument = () => {
    onChange([
      ...documents,
      { type: DocumentType.CPF, value: '', issuingDate: null, issuingAgency: '' }
    ]);
  };

  const handleRemoveDocument = (index: number) => {
    onChange(documents.filter((_, i) => i !== index));
  };

  const handleDocumentChange = (index: number, field: keyof PersonalDocument, value: any) => {
    const newDocs = [...documents];
    if (field === 'issuingDate' && value) {
      newDocs[index] = { 
        ...newDocs[index], 
        [field]: value.toISOString().split('T')[0] 
      };
    } else {
      newDocs[index] = { ...newDocs[index], [field]: value };
    }
    onChange(newDocs);
  };

  const getDocumentMask = (type: DocumentType) => {
    return DocumentPatterns[type] || '';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDocument}
        >
          Adicionar Documento
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {documents.map((document, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Select
              fullWidth
              value={document.type}
              onChange={(e) => handleDocumentChange(index, 'type', e.target.value)}
            >
              {Object.values(DocumentType).map((type) => (
                <MenuItem key={type} value={type}>
                  {EnumLabels.DocumentType[type]}
                </MenuItem>
              ))}
            </Select>
            
            <InputMask
              mask={getDocumentMask(document.type)}
              value={document.value || ''}
              onChange={(e) => handleDocumentChange(index, 'value', e.target.value)}
            >
              {(inputProps: any) => (
                <TextField
                  {...inputProps}
                  fullWidth
                  label="Número do Documento"
                />
              )}
            </InputMask>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Data de Emissão"
                value={document.issuingDate ? new Date(document.issuingDate) : null}
                onChange={(date) => handleDocumentChange(index, 'issuingDate', date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              label="Órgão Emissor"
              value={document.issuingAgency || ''}
              onChange={(e) => handleDocumentChange(index, 'issuingAgency', e.target.value)}
            />

            <IconButton
              color="error"
              onClick={() => handleRemoveDocument(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
} 