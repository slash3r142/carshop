export type Car = {
  brand: string;
  model: string;
  color: string;
  fuel: string;
  modelYear: number;
  price: number;
  _links: {
    self: {
      href: string;
    };
    car: {
      href: string;
    };
  };
};


export type CarResponse = {
  _embedded: {
    cars: Car[];
  };
};


export type NewCar = {
  brand: string;
  model: string;
  color: string;
  fuel: string;
  modelYear: number;
  price: number;
};

