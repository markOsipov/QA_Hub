import {useEffect, useRef} from "react";
import {TextField} from "@mui/material";

export default function AutoFocusTextField(props) {
    const inputRef = useRef();

    useEffect(() => {
        const timeout = setTimeout(() => {
            inputRef.current.focus();
        }, 100);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return <TextField inputRef={inputRef} {...props} />;
}