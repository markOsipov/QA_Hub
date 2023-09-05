import {createTheme} from "@mui/material/styles";

export var customTheme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#666bb3',
        },
        secondary: {
            main: '#9ea9ee',
        },
        background: {
            default: '#303030',
            popup: 'rgb(86 86 86)',
            paper: '#424242',
            input: 'rgba(255, 255, 255, 0.1)',
            textArea: 'rgba(255, 255, 255, 0.07)',

            hoverHighlight: 'rgba(255, 255, 255, 0.1)'
        },
        success: {
            main: '#3e812a',
        },
        error: {
            main: '#c44849',
            faded: 'rgba(196, 72, 73, 0.13)',
        },
        warning: {
            main: '#cf9f05',
            faded: 'rgba(207,159,5,0.13)',
        },
        table: {
            header: '#3b3b3b',
            evenRow: '#00000022'
        },

        text: {
            white: '#ffffff',
            primary: 'rgba(255, 255, 255, 0.75)',
            faded: 'rgba(255, 255, 255, 0.6)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledMore: 'rgba(255, 255, 255, 0.2)'
        },
    },
});