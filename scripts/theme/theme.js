import { createTheme } from '@mui/material/styles/index.js';

const theme = createTheme({
  palette: {
    primary: {
      light: '#63a4fff',
      main: '#1976d2',
      dark: '#004ba0',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff833a',
      main: '#e65100',
      dark: '#ac1900',
      contrastText: '#fff',
    },
    background: {
      default: '#e8eaf6',
    },
    text: {
      primary: '#2e2e2e',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: [
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
      letterSpacing: '-0.24px',
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
      letterSpacing: '-0.24px',
    },
    h3: {
      fontSize: '1.64rem',
      fontWeight: 500,
      letterSpacing: '-0.06px',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '-0.06px',
    },
    h5: {
      fontSize: '1.285rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.142rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '6px 12px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
        },
      },
    },
    // we can add more if needed
  },
});

export default theme;
