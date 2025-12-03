import { Box, Button, Chip, Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import React from 'react';
import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const MyPlace: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Law Office Management System
      </Typography>

      <Grid container spacing={3}>
        {/* Próximos Compromissos Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon />
              Próximos Compromissos
            </Typography>
            <List dense>
              <ListItem
                sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}
                secondaryAction={
                  <Chip label="Audiência" size="small" color="primary" variant="outlined" />
                }
              >
                <ListItemText
                  primary="Audiência de Conciliação"
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        20/04/2024 às 14:00
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fórum Central - Sala 123
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem
                sx={{ bgcolor: 'grey.50', borderRadius: 1 }}
                secondaryAction={
                  <Chip label="Reunião" size="small" color="secondary" variant="outlined" />
                }
              >
                <ListItemText
                  primary="Reunião de Acompanhamento"
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        25/04/2024 às 10:00
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Unidade - Sala de Reuniões
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Últimas Movimentações Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon />
              Últimas Movimentações
            </Typography>
            <List dense>
              <ListItem
                sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}
                secondaryAction={
                  <Chip label="Sentença" size="small" color="primary" variant="outlined" />
                }
              >
                <ListItemText
                  primary="Sentença expedida"
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        20/04/2024 às 14:00
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sentença expedida
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem
                sx={{ bgcolor: 'grey.50', borderRadius: 1 }}
                secondaryAction={
                  <Chip label="Petição" size="small" color="secondary" variant="outlined" />
                }
              >
                <ListItemText
                  primary="Petição enviada"
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        25/04/2024 às 10:00
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Petição enviada
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Últimos Documentos Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={1} sx={{ p: 2.5, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentIcon />
              Últimos Documentos
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2">Procuração</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Assinado em: 01/03/2024
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }}>
                    Visualizar
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2">Contrato de Honorários</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Assinado em: 01/03/2024
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }}>
                    Visualizar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyPlace;
