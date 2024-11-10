import { 
  Box, 
  TextField,
  Stack,
  Button,
  Typography,
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import { DocumentType, ContactType, AddressType, Country, PersonType } from '../shared/enums';
import { DocumentSection } from './DocumentSection';
import { ContactSection } from './ContactSection';
import { AddressSection } from './AddressSection';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';

interface PersonalDocument {
  type: DocumentType;
  value: string | null;
  issuingDate: Date | null;
  issuingAgency: string | null;
}

interface Contact {
  type: ContactType;
  value: string | null;
}

interface Address {
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  country: Country;
  zipCode: string | null;
  addressType: AddressType;
}

interface PersonalData {
  name: string | null;
  namePart2: string | null;
  displayName: string | null;
  birthDate: string | null;
  personType: PersonType | undefined;
  contacts: Contact[];
  addresses: Address[];
  personalDocuments: PersonalDocument[];
  representatives?: Representative[];
}

interface PersonalDataSectionProps {
  personalData: PersonalData;
  onChange: (newPersonalData: PersonalData) => void;
}

interface Representative {
  role: string;
  personalData: PersonalData;
}

function RepresentativeSection({ 
  representatives = [], 
  onChange 
}: { 
  representatives: Representative[],
  onChange: (newRepresentatives: Representative[]) => void 
}) {
  const handleAddRepresentative = () => {
    onChange([
      ...representatives,
      {
        role: '',
        personalData: {
          name: null,
          namePart2: null,
          displayName: null,
          birthDate: null,
          personType: PersonType.NATURAL,
          contacts: [],
          addresses: [],
          personalDocuments: [],
          representatives: []
        }
      }
    ]);
  };

  const handleRemoveRepresentative = (index: number) => {
    onChange(representatives.filter((_, i) => i !== index));
  };

  const handleRepresentativeChange = (index: number, field: keyof Representative, value: any) => {
    const newRepresentatives = [...representatives];
    newRepresentatives[index] = {
      ...newRepresentatives[index],
      [field]: value
    };
    onChange(newRepresentatives);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Representantes
        </Typography>
        <Button
          startIcon={<PersonAddIcon />}
          onClick={handleAddRepresentative}
          variant="outlined"
          size="small"
        >
          Adicionar Representante
        </Button>
      </Box>

      <Stack spacing={3}>
        {representatives.map((representative, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{ p: 2, position: 'relative' }}
          >
            <IconButton
              size="small"
              onClick={() => handleRemoveRepresentative(index)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Cargo/Função"
                variant="outlined"
                value={representative.role}
                onChange={(e) => handleRepresentativeChange(index, 'role', e.target.value)}
                placeholder="Ex: Diretor, Procurador, Sócio"
              />

              <Divider />

              <PersonalDataSection
                personalData={representative.personalData}
                onChange={(newPersonalData) => 
                  handleRepresentativeChange(index, 'personalData', newPersonalData)
                }
              />
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export function PersonalDataSection({ personalData, onChange }: PersonalDataSectionProps) {
  const isNaturalPerson = personalData.personType === PersonType.NATURAL;

  const handleChange = (field: keyof PersonalData, value: any) => {
    onChange({
      ...personalData,
      [field]: value
    });
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            required
            label={isNaturalPerson ? "Nome Próprio" : "Razão Social"}
            variant="outlined"
            placeholder={isNaturalPerson ? "João" : "Empresa LTDA"}
            value={personalData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            required
            label={isNaturalPerson ? "Sobrenome" : "Nome Fantasia"}
            variant="outlined"
            placeholder={isNaturalPerson ? "da Silva" : "Nome Fantasia"}
            value={personalData.namePart2 || ''}
            onChange={(e) => handleChange('namePart2', e.target.value)}
          />
        </Box>
      </Box>

      <DocumentSection
        documents={personalData.personalDocuments}
        onChange={(newDocuments) => handleChange('personalDocuments', newDocuments)}
      />

      <ContactSection
        contacts={personalData.contacts}
        onChange={(newContacts) => handleChange('contacts', newContacts)}
      />

      <AddressSection
        addresses={personalData.addresses}
        onChange={(newAddresses) => handleChange('addresses', newAddresses)}
      />

      {personalData.personType === PersonType.LEGAL && (
        <RepresentativeSection
          representatives={personalData.representatives || []}
          onChange={(newRepresentatives) => handleChange('representatives', newRepresentatives)}
        />
      )}
    </Stack>
  );
} 