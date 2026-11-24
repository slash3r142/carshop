import type { CarResponse } from './types';

export const fetchCars = (): Promise<CarResponse> => {
  return fetch(`${import.meta.env.VITE_API_URL}/cars`).then((response) => {
    if (!response.ok) {
      throw new Error(`Error in fetch: ${response.status} ${response.statusText}`);
    }
    return response.json();
  });
};