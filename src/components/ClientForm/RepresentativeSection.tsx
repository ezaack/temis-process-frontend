import { 
  Box, 
  TextField,
  Stack,
  Button,
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import { PersonType } from '../shared/enums';
import { PersonalDataSection } from './PersonalDataSection';
import { Add, Close as CloseIcon } from '@mui/icons-material';
import { PersonalData } from './types';

interface Representative {
  representativeType: 'PROXY' | 'ATTOURNEY_IN_FACT' | 'LEGAL_GUARDIAN' | 'CURATOR' | 
    'LEGAL_REPRESENTATIVE' | 'ADMINISTRATOR' | 'MANAGER' | 'DIRECTOR' | 'CEO' | 
    'CFO' | 'PRESIDENT' | 'BOARD_MEMBER';
  personalData: PersonalData;
}

interface RepresentativeSectionProps {
  representatives: Representative[];
  onChange: (newRepresentatives: Representative[]) => void;
}

const representativeTypes = {
  PROXY: 'Procurador',
  ATTOURNEY_IN_FACT: 'Procurador de Fato',
  LEGAL_GUARDIAN: 'Guardião Legal',
  CURATOR: 'Curador',
  LEGAL_REPRESENTATIVE: 'Representante Legal',
  ADMINISTRATOR: 'Administrador',
  MANAGER: 'Gerente',
  DIRECTOR: 'Diretor',
  CEO: 'Diretor Executivo',
  CFO: 'Diretor Financeiro',
  PRESIDENT: 'Presidente',
  BOARD_MEMBER: 'Membro do Conselho'
};

export function RepresentativeSection({ representatives, onChange }: RepresentativeSectionProps) {
  const handleAddRepresentative = () => {
    onChange([...representatives, {
        representativeType: 'LEGAL_REPRESENTATIVE',
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
        }}]);
  };

  const handleRemoveRepresentative = (index: number) => {
    const newRepresentatives = representatives.filter((_, i) => i !== index);
    onChange(newRepresentatives);
  };

  const handleRepresentativeChange = (index: number, field: keyof Representative, value: any) => {
    console.log(`Updating representative at index ${index}, field: ${field}`, value);
    const newRepresentatives = [...representatives];
    newRepresentatives[index] = {
      ...newRepresentatives[index],
      [field]: value
    };
    console.log('Updated representatives:', newRepresentatives);
    onChange(newRepresentatives);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          startIcon={<Add />}
          onClick={handleAddRepresentative}
          variant="contained"
          size="small"
        >
          Adicionar Representante
        </Button>
      </Box>

      <Stack spacing={2}>
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
                select
                fullWidth
                label="Tipo de Representante"
                variant="outlined"
                value={representative.representativeType}
                onChange={(e) => handleRepresentativeChange(index, 'representativeType', e.target.value)}
                SelectProps={{
                  native: true
                }}
              >
                {Object.entries(representativeTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </TextField>

              <Divider />

              <PersonalDataSection
                personalData={representative.personalData}
                onChange={(newPersonalData) => {
                  handleRepresentativeChange(index, 'personalData', newPersonalData);
                }}
                isRepresentative={true}
              />
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
} 