'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8',
      light: '#4285f4',
      dark: '#1557b0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5f6368',
      light: '#80868b',
      dark: '#3c4043',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
    },
    divider: '#dadce0',
    success: {
      main: '#1e8e3e',
      light: '#e6f4ea',
    },
    warning: {
      main: '#f9ab00',
      light: '#fef7e0',
    },
    error: {
      main: '#d93025',
      light: '#fce8e6',
    },
    info: {
      main: '#1a73e8',
      light: '#e8f0fe',
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 500,
      letterSpacing: 0,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '6px 16px',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          border: '1px solid #dadce0',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#dadce0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#202124',
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'inherit',
      },
      styleOverrides: {
        root: {
          borderBottom: '1px solid #dadce0',
          backgroundColor: '#ffffff',
          color: '#202124',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f9fa',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#3c4043',
            borderBottom: '1px solid #dadce0',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e8eaed',
          padding: '12px 16px',
        },
      },
    },
  },
});

export default theme;
