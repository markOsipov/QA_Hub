import {useEffect, useRef} from "react";
import {TextareaAutosize, TextField} from "@mui/material";

export default function AutoFocusTextArea({...props}) {
    const inputRef = useRef(null);

    function moveCaretAtEnd(e) {
        let temp_value = e.target.value
        e.target.value = ''
        e.target.value = temp_value
    }

    useEffect(() => {
        if (!props.disabled) {
            inputRef?.current?.focus()
        }
    }, [props.disabled])

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         inputRef.current.focus();
    //     }, 100);
    //
    //     return () => {
    //         clearTimeout(timeout);
    //     };
    // }, []);

    return <TextareaAutosize style={{padding: "5px"}} ref={inputRef} autoFocus onFocus={moveCaretAtEnd} {...props}/>;
}