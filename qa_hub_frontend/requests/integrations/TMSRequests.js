import axios from "axios";
import process from "../../next.config";

export function getTmsTypes() {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/tms/types"),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function getTmsIntegrations() {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/tms/integrations"),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function addTmsIntegration(tms) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/tms/integrations/add"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: tms
    }

    return axios(config)
}

export function updateTmsIntegration(tms) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/tms/integrations/update"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: tms
    }

    return axios(config)
}

export function deleteTmsIntegration(tmsId) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/tms/integrations/delete/${tmsId}`),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}