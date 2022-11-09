import {createTheme} from "@mui/material/styles";

export var customTheme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#8b8fde',
        },
        secondary: {
            main: '#5765b9',
        },
        background: {
            default: '#303030',
            paper: '#424242',
        },
        success: {
            main: '#419036',
        },
        error: {
            main: '#c44849',
        },
        warning: {
            main: '#e88103',
        },
    },
});