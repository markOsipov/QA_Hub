import {createTheme} from "@mui/material/styles";

export var customTheme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#7479c7',
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
        table: {
            header: '#3b3b3b',
            evenRow: '#00000022'
        },
        text: {
            primary: 'rgba(255,255,255,0.75)',
            white: '#ffffff'
        }
    },
});