import { useState, useEffect } from 'react';
import { DataGrid} from '@mui/x-data-grid';
import type {GridColDef } from '@mui/x-data-grid';
import { Box, Button,Stack, TextField } from '@mui/material';
import type { Car } from './types';
import { fetchCars,fetchCarById } from './carApi';

//npm install @mui/x-data-grid
//npm install @mui/icons-material
//npm install @mui/material @emotion/react @emotion/styled
export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);

  const [carId, setCarId] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null); //initialized to null 

  useEffect(() => {
    fetchCars()
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  }, []);

  const handleGetCar = () => {
    if (!carId) return;
    fetchCarById(Number(carId)) //implicit cast 
      .then((car) => setSelectedCar(car)) 
      .catch((err) => {
        setSelectedCar(null);
        console.error(err);
      });
  };

  const columns: GridColDef[] = [
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'color', headerName: 'Color', width: 130 },
    { field: 'fuel', headerName: 'Fuel', width: 120 },
    { field: 'modelYear', headerName: 'Year', width: 110 },
    { field: 'price', headerName: 'Price (€)', width: 130 },
  ];

  return (
    <Stack spacing={2} sx={{ width: '100%', mt: 2 }}>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Car ID"
          type="number"
          size="small"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
        />
        <Button variant="contained" onClick={handleGetCar}>
          Get Car
        </Button>
      </Stack>
      {selectedCar && (
        <p>
          Selected car:
           {selectedCar.brand} {selectedCar.model} 
           ({selectedCar.modelYear}) — {selectedCar.color},
            {selectedCar.fuel}, {selectedCar.price} €
        </p>
      )}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={cars}
          columns={columns}
          getRowId={(row) => row._links.self.href}
        />
      </Box>
    </Stack>
  );
}

/*). With the Car Shop REST API, the backend already
 gives every car a permanent, unique identifier: _links.self.href 

 which is why uuid is not needed */ 