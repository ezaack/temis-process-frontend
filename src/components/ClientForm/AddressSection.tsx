import { Box, Button, Paper, Grid, IconButton, TextField, Select, MenuItem } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AddressType, Country, State, EnumLabels } from '../shared/enums';
import InputMask from 'react-input-mask';
import { ValidationPatterns } from '../shared/enums';

interface Address {
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: State | null;
  country: Country;
  zipCode: string | null;
  addressType: AddressType;
}

interface AddressSectionProps {
  addresses: Address[];
  onChange: (addresses: Address[]) => void;
}

export function AddressSection({ addresses, onChange }: AddressSectionProps) {
  const handleAddAddress = () => {
    onChange([
      ...addresses,
      {
        street: null,
        number: null,
        complement: null,
        neighborhood: null,
        city: null,
        state: null,
        country: Country.BRAZIL,
        zipCode: null,
        addressType: AddressType.HOME
      }
    ]);
  };

  const handleRemoveAddress = (index: number) => {
    onChange(addresses.filter((_, i) => i !== index));
  };

  const handleAddressChange = (index: number, field: keyof Address, value: any) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { 
      ...newAddresses[index], 
      [field]: value === '' ? null : value 
    };
    onChange(newAddresses);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAddress}
        >
          Adicionar Endereço
        </Button>
      </Box>

      {addresses.map((address, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Select
                fullWidth
                value={address.addressType}
                onChange={(e) => handleAddressChange(index, 'addressType', e.target.value)}
                label="Tipo de Endereço"
              >
                {Object.values(AddressType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {EnumLabels.AddressType[type]}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} md={4}>
              <InputMask
                mask={ValidationPatterns.zipCode}
                value={address.zipCode || ''}
                onChange={(e) => handleAddressChange(index, 'zipCode', e.target.value)}
              >
                {(inputProps: any) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    label="CEP"
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Cidade"
                value={address.city || ''}
                onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Rua"
                value={address.street || ''}
                onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Número"
                value={address.number || ''}
                onChange={(e) => handleAddressChange(index, 'number', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Complemento"
                value={address.complement || ''}
                onChange={(e) => handleAddressChange(index, 'complement', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bairro"
                value={address.neighborhood || ''}
                onChange={(e) => handleAddressChange(index, 'neighborhood', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Select
                fullWidth
                value={address.state || ''}
                onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                label="Estado"
              >
                {Object.values(State).map((state) => (
                  <MenuItem key={state} value={state}>
                    {EnumLabels.State[state]}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveAddress(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
} 