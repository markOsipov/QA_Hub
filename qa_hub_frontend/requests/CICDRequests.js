import axios from "axios";
import process from "../next.config";

export function getCicdTypes() {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/cicd/types"),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function getCicdIntegrations() {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/cicd/integrations"),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function addCicdIntegration(cicd) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/cicd/integrations/add"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: cicd
    }

    return axios(config)
}

export function updateCicdIntegration(cicd) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/cicd/integrations/update"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: cicd
    }

    return axios(config)
}

export function deleteCicdIntegration(cicdId) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/cicd/integrations/delete/${cicdId}`),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}