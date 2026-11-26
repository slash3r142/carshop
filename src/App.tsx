import { AppBar, Toolbar, Container } from '@mui/material';
import CarList from './CarList';

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>Car Shop</Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <CarList />
      </Container>
    </>
  );
}