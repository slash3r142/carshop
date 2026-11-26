import { useState, useEffect } from 'react';
import { DataGrid} from '@mui/x-data-grid';
import type {GridColDef } from '@mui/x-data-grid';
import { Box, Button,Stack, TextField } from '@mui/material';
import type { Car, NewCar } from './types';
import { fetchCars,fetchCarById, addCar, updateCar, deleteCar } from './carApi';

//npm install @mui/x-data-grid
//npm install @mui/icons-material
//npm install @mui/material @emotion/react @emotion/styled

const emptyCar: NewCar ={
  brand: '',
  model: '',
  color: '',
  fuel: '',
  modelYear: 0,
  price: 0,
}


export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);

  const [carId, setCarId] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null); //initialized to null 

  const [newCar, setNewCar] = useState<NewCar>(emptyCar);

  const [editId, setEditId] = useState<number | null>(null);
  //tracks the ID of car currently being eidted; used for both tracking which mode is in (creating or editing) and which car to overwrite
  //otherwise splitting into isEditing and carIdToEdit would create impossible state 
  // https://react.dev/learn/choosing-the-state-structure
  


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

const handleAddCar = () => {
    if (
      !newCar.brand ||
      !newCar.model ||
      !newCar.color ||
      !newCar.fuel ||
      !newCar.modelYear ||
      !newCar.price
    ) {
      return;
    }

    addCar(newCar)
      .then((car1) => {
        setCars([...cars,car1]);
        setNewCar(emptyCar);
        //clears input after setting 
      })
      .catch((err) => console.error(err));
  };

const handleEditClick = (car: Car) => {
  const id= Number(car._links.self.href.split('/').pop());
  /*car._links.self.href: Reads the URL string, such as
   "[https://car-rest-service-carshop.2.rahtiapp.fi/cars/3]
.split('/'): Cuts the string at every / and turns it into an array of 
substrings:["https:", "", "car-rest-service-carshop.2.rahtiapp.fi", "cars", "3"]
.pop(): Grabs and returns the last element from that array, giving the string "3".*/
  setEditId(id);
    setNewCar({
      brand: car.brand,
      model: car.model,
      color: car.color,
      fuel: car.fuel,
      modelYear: car.modelYear,
      price: car.price,
    });
}
//pulls ID from car._links...., saves it into editID and copies the car to be edited's
//properties into NewCar 

const handleUpdateCar = () => {
    if (editId === null ||  
      !newCar.brand ||
      !newCar.model ||
      !newCar.color ||
      !newCar.fuel ||
      !newCar.modelYear ||
      !newCar.price) return;

    updateCar(editId, newCar)
      .then((updatedCar) => {
        setCars( //replaces old array containing all cars with new one
          cars.map((car) =>
            car._links.self.href === updatedCar._links.self.href ? updatedCar : car
          //its not possible to overwrite car directly (car=updatedCar) which is why 
          //map is used to loop all over every item and update the car 
          )
        );
        setEditId(null);
        setNewCar(emptyCar);
      })
      .catch((err) => console.error(err));
  };

//initial state editID is null -> handleEditClick sets editId to 3 and loads the car's 
//properties into newCar -> typing updates newCar in state, editID stays the same (not null) 
// -> handleUpdateCar calls updateCar(3, newCar) sending PUT /cars/3 to backend 
// -> server returns updatedCar 

const handleCancelEdit = () => {
    setEditId(null);
    setNewCar(emptyCar);
  }; 


const handleDeleteCar = (car: Car) => {
    const id = Number(car._links.self.href.split('/').pop());

    deleteCar(id) //from carApi 
      .then(() => {
        setCars(cars.filter((car1) => car1._links.self.href !== car._links.self.href));
        //creates new array excluding deleted car 
        if (editId === id) {
          handleCancelEdit();
        } // removes the car being edited from input if it's deleted while editing 
      })
      .catch((err) => console.error(err));
  };


  const columns: GridColDef[] = [
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'color', headerName: 'Color', width: 130 },
    { field: 'fuel', headerName: 'Fuel', width: 120 },
    { field: 'modelYear', headerName: 'Year', width: 110 },
    { field: 'price', headerName: 'Price (€)', width: 130 },
    {
      field: 'Edit', width:100, sortable:false, renderCell: (params)=>(
        <Button size="small" 
        onClick={()=>handleEditClick(params.row)}>Edit</Button>
      )
    },
    { field: 'Delete', width:100, sortable:false,
      renderCell: (params) => (
        <Button size="small" color="error" onClick={() => handleDeleteCar(params.row)}>
          Delete
        </Button>
      ),
     }

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

      <Stack 
      direction="row" 
      spacing={1}
      
      sx={{alignItems: "center"}}>
        <TextField
          label="Brand"
          size="small"
          value={newCar.brand}
          onChange={(event) => setNewCar({ ...newCar, brand: event.target.value })}
        />
        <TextField
          label="Model"
          size="small"
          value={newCar.model}
          onChange={(event) => setNewCar({ ...newCar, model: event.target.value })}
        />
        <TextField
          label="Color"
          size="small"
          value={newCar.color}
          onChange={(event) => setNewCar({ ...newCar, color: event.target.value })}
        />
        <TextField
          label="Fuel"
          size="small"
          value={newCar.fuel}
          onChange={(event) => setNewCar({ ...newCar, fuel: event.target.value })}
        />
        <TextField
          label="Year"
          type="number"
          size="small"
          value={newCar.modelYear || ''}
          onChange={(event) => setNewCar({ ...newCar, modelYear: Number(event.target.value) })}
        />
        <TextField
          label="Price (€)"
          type="number"
          size="small"
          value={newCar.price || ''}
          onChange={(event) => setNewCar({ ...newCar, price: Number(event.target.value) })}
        />

        {editId===null?(
          <Button 
        variant="contained"
        size='small'
        //color='success'
         onClick={handleAddCar}>
          Add Car
        </Button>):(
          <>
          <Button variant="contained" color="success" onClick={handleUpdateCar}>
              Update Car
            </Button>
            <Button variant="outlined" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </>
        )
        
        }

        
      </Stack>


      {selectedCar && (
        <p>
          Selected car:
           {selectedCar.brand} {selectedCar.model} 
           ({selectedCar.modelYear}), {selectedCar.color},
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