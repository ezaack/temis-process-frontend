import { useState } from 'react';
import { HiQuestionMarkCircle } from 'react-icons/hi';
import { DocumentType, EnumLabels, getEnumOptions, PersonType } from '../../components/shared/enums';
import { Button, ButtonGroup, TextField, ToggleButtonGroup, ToggleButton, Select, MenuItem, InputLabel, Stack, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export function ClientForm() {
  const [formData, setFormData] = useState({
    description: '',
    howDidYouHearAboutUs: '',
    personalData: {
      name: '',
      namePart2: '',
      displayName: '',
      birthDate: '',
      personType: 'NATURAL',
      contacts: [{ type: 'PERSONAL_CELL_PHONE', value: '' }],
      addresses: [{
        street: '',
        complement: '',
        number: '',
        country: 'BRAZIL',
        state: '',
        city: '',
        addressType: 'HOME',
        zipCode: ''
      }],
      personalDocuments: [{
        type: 'CPF',
        value: '',
        issuingDate: '',
        issuingAgency: ''
      }]
    }
  });

  const [selectedPersonType, setSelectedPersonType] = useState<PersonType>(PersonType.NATURAL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(JSON.stringify(e));
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Novo Cliente
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-6.5">
          {/* Basic Information */}
          <div className="mb-4.5">
            <InputLabel className="mb-2.5 block text-black dark:text-white">
              Breve descrição do cliente
            </InputLabel>
            <div className="relative group">
              <HiQuestionMarkCircle 
                className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-help" 
                title="Uma breve explicação do cliente, como para qual empresa trabalha, ou uma desanbiguação para facilmente separa-lo de clientes homonimos"
              />
            </div>
            <TextField  variant="outlined"
              type="text"
              placeholder="Insira uma breve descrição"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="mb-4.5">
            <InputLabel className="mb-2.5 block text-black dark:text-white">
              Como nos conheceu?
            </InputLabel>
            <TextField  variant="outlined"
              type="text"
              placeholder="Pesquisa no google, campanhar de facebook, campanha de instagram etc"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={formData.howDidYouHearAboutUs}
              onChange={(e) => setFormData({...formData, howDidYouHearAboutUs: e.target.value})}
            />
          </div>

          <div className="mt-4.5">
              <InputLabel className="mb-2.5 block text-black dark:text-white">Tipo de Pessoa</InputLabel>
              <ToggleButtonGroup
                color="primary"
                value={formData.personalData.personType}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    setFormData({
                      ...formData,
                      personalData: {
                        ...formData.personalData,
                        personType: newValue
                      }
                    });
                  }
                }}
                aria-label="Person Type"
              >
                {Object.values(PersonType).map((personType) => (
                  <ToggleButton 
                    key={personType}
                    value={personType}
                    sx={{ px: 3 }}
                  >
                    {EnumLabels.PersonType[personType]}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
          {/* Personal Data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel className="mb-2.5 block text-black dark:text-white">Nome Próprio</InputLabel>
              <TextField  variant="outlined"
                type="text"
                placeholder="João"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                value={formData.personalData.name}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: {...formData.personalData, name: e.target.value}
                })}
              />
            </div>

            <div>
              <InputLabel className="mb-2.5 block text-black dark:text-white">Sobrenome</InputLabel>
              <TextField  variant="outlined"
                type="text"
                placeholder="da Silva"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                value={formData.personalData.namePart2}
                onChange={(e) => setFormData({
                  ...formData,
                  personalData: {...formData.personalData, namePart2: e.target.value}
                })}
              />
            </div>
          </div>
          {/* Personal Documents list */}
          <div className="mt-4.5">
            <div className="flex justify-between items-center mb-4">
              <InputLabel className="text-black dark:text-white">
                Documentos Pessoais
              </InputLabel>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setFormData({
                    ...formData,
                    personalData: {
                      ...formData.personalData,
                      personalDocuments: [
                        ...formData.personalData.personalDocuments,
                        { type: DocumentType.CPF, value: '', issuingDate: '', issuingAgency: '' }
                      ]
                    }
                  });
                }}
              >
                Adicionar
              </Button>
            </div>

            <Stack spacing={2}>
              {formData.personalData.personalDocuments.map((document, index) => (
                <Grid 
                  container 
                  key={index} 
                  spacing={2} 
                  alignItems="center"
                >
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="Número do Documento"
                      variant="outlined"
                      value={document.value}
                      onChange={(e) => {
                        const newDocs = [...formData.personalData.personalDocuments];
                        newDocs[index] = { ...document, value: e.target.value };
                        setFormData({
                          ...formData,
                          personalData: {
                            ...formData.personalData,
                            personalDocuments: newDocs
                          }
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Select
                      fullWidth
                      variant="outlined"
                      value={document.type}
                      onChange={(e) => {
                        const newDocs = [...formData.personalData.personalDocuments];
                        newDocs[index] = { ...document, type: e.target.value };
                        setFormData({
                          ...formData,
                          personalData: {
                            ...formData.personalData,
                            personalDocuments: newDocs
                          }
                        });
                      }}
                    >
                      {Object.values(DocumentType).map((documentType) => (
                        <MenuItem  key={documentType} value={documentType}>
                          {EnumLabels.DocumentType[documentType]}
                        </MenuItem >
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <IconButton
                      onClick={() => {
                        const newDocs = [...formData.personalData.personalDocuments];
                        newDocs.splice(index, 1);
                        setFormData({
                          ...formData,
                          personalData: {
                            ...formData.personalData,
                            personalDocuments: newDocs
                          }
                        });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </div>
          {/* Contact list */}
          {/* Address list */}

          {/* Submit Button */}
          <Button variant="contained"
            type="submit"
          >
            Salvar Cliente
          </Button>
        </div>
      </form>
    </div>
  );
} 