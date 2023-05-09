import process from "../next.config";
import axios from "axios";

export function getParamTypes() {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/testRunForms/paramTypes"),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function getTestRunForm(project) {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testRunForms/${project}`),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function upsertTestRunForm(testRunForm) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testRunForms/upsert`),
        headers: {
            'Content-Type': 'application/json'
        },
        data: testRunForm
    }

    return axios(config)
}

export function deleteTestRunForm(testRunForm) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testRunForms/delete`),
        headers: {
            'Content-Type': 'application/json'
        },
        data: testRunForm
    }

    return axios(config)
}