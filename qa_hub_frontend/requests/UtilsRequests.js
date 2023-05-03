import process from "../next.config";
import axios from "axios";

export function getLogs(linesCount) {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/utils/logs"),
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            linesCount: linesCount
        }
    }

    return axios(config)
}