import { AppBar, Toolbar, Typography, Container, CssBaseline } from '@mui/material';
import CarList from './CarList';

export default function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Car Shop</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <CarList />
      </Container>
    </>
  );
}