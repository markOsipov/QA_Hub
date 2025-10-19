import {useEffect, useState} from "react";
import {getTestLogs} from "../../../../../../requests/testResults/TestLogsRequests";
import LogRow from "./LogRow";
import {customTheme} from "../../../../../../styles/CustomTheme";
import Loader from "../../../../../common/Loader";
import { getAttachment } from "../../../../../../requests/testResults/TestAttachmentsRequests";
import { Typography } from "@mui/material";

export default function ScreenshotAttachmentPanel({attachment, ...props}) {
    const [ready, setReady] = useState(false)
    const [imageSrc, setImageSrc] = useState(`${process.env.NEXT_PUBLIC_QA_HUB_BACKEND}/${attachment.path}`)

    useEffect(() => {
        setImageSrc(`${process.env.NEXT_PUBLIC_QA_HUB_BACKEND}/${attachment.path}`)
    }, [attachment])

    return  <div style={{...props.style}}>
        {
            <a
            href={imageSrc}
            target={"_blank"}
            rel="noreferrer"
            style={{display: ready ? 'block' : 'none'}}
            >
            <img             
                src={imageSrc}
                style={{maxWidth: '100%', border: '1px solid', borderColor: customTheme.palette.text.disabled, borderRadius: '3px'}}
                onLoad={() => {setReady(true)}}
            ></img>
            </a>
        }
        {
            !ready &&
            <div
                style={{
                    width: "100%",
                    height: "400px",
                    display: 'grid',
                    placeItems: 'center',              
                    backgroundColor: customTheme.palette.background.paper
                }}
            >
            <Typography variant="h5">Loading...</Typography>
            </div>
        }
    </div>
}