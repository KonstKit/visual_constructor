import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Data Flow Builder
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/algorithm-builder">
            Algorithm Builder
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <Outlet />
      </main>
    </>
  );
}
