import type { Car, CarResponse, NewCar } from './types';

export const fetchCars = (): Promise<CarResponse> => {
  return fetch(`${import.meta.env.VITE_API_URL}/cars`).then((response) => {
    if (!response.ok) {
      throw new Error(`Error in fetch: ${response.status} ${response.statusText}`);
    }
    return response.json();
  });
};


export const fetchCarById = (id: number): Promise<Car> => {
  return fetch(`${import.meta.env.VITE_API_URL}/cars/${id}`).then((response) => {
    if (!response.ok) {
      throw new Error(`Error in fetch: ${response.status} ${response.statusText}`);
    }
    return response.json();
  });
};

export const addCar = (car: NewCar): Promise<Car> => {
    //): Promises to return a complete Car object once the server 
    // finishes saving it and attaches the generated _links URLs.
    // hence the name "promise"
    return fetch(`${import.meta.env.VITE_API_URL}/cars`,{
        method: 'POST', //actually saves a car to the backend 
        headers: {
            'Content-Type' : 'application/json',
        }, // standard use (application/json and stringify )
        body: JSON.stringify(car),
    }).then((response)=>{
        if(!response.ok) {
            throw new Error('Error: ${response.status}');
        }
        return response.json();
    })
}
/*Unlike GET requests (where fetch(url) only needs the URL),
 sending data requires a second argument—an options object with 
 three properties:
1.method: 'POST': Instructs the REST API that you are creating 
a new record rather than reading existing ones (GET).
2. headers: { 'Content-Type': 'application/json' }:
 Tells the backend server that the incoming data is 
 formatted as JSON so it knows how to parse the request body.
  Without this header, the server rejects the request with a 
  415 Unsupported Media Type error.
3. body: JSON.stringify(car): HTTP requests can only 
transmit plain text over the network, not raw JavaScript objects.
 JSON.stringify() converts the car object into a JSON string
  (for example, '{"brand":"BMW","model":"3",...}').*/

  export const updateCar= (id: number, car: NewCar): Promise<Car> => {
    return fetch(`${import.meta.env.VITE_API_URL}/cars/${id}`,{
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(car),
    }).then(response => {
      if(!response.ok){
        throw new Error('Error: ${response.status}')
      }
      return response.json();
    })
  }
// takes id of the car to be edited + newCar object, sends 'PUT" request and returns 
// servers newly saved car 



  export const deleteCar = (id: number): Promise<void> => {
  return fetch(`${import.meta.env.VITE_API_URL}/cars/${id}`, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error : ${response.status} ${response.statusText}`);
    }
  }); //no return response.json() because server replies with 204 empty body (void) 
};