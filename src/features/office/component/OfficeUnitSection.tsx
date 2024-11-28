import React from 'react';
import { Box, TextField, Grid } from '@mui/material';

interface OfficeUnitSectionProps {
  officeUnits: {
    name: string;
    registrationNumber: string;
    contacts: any[];
    addresses: any[];
  }[];
  onChange: (newUnits: any[]) => void;
}

const OfficeUnitSection: React.FC<OfficeUnitSectionProps> = ({ officeUnits = [], onChange }) => {
  return (
    <Box>
      {officeUnits.map((unit, index) => (
        <Grid container spacing={2} key={index}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Unit Name"
              variant="outlined"
              value={unit.name}
              onChange={(e) => {
                const newUnits = [...officeUnits];
                newUnits[index].name = e.target.value;
                onChange(newUnits);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Registration Number"
              variant="outlined"
              value={unit.registrationNumber}
              onChange={(e) => {
                const newUnits = [...officeUnits];
                newUnits[index].registrationNumber = e.target.value;
                onChange(newUnits);
              }}
            />
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default OfficeUnitSection; 