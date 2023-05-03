import process from "../next.config";
import axios from "axios";

export function hardReset() {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/config/hardReset"),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function clearData() {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/config/clearData"),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}