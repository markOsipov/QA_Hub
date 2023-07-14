import process from "../next.config";
import axios from "axios";

export function createNewTestRun(project, params) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/testRuns/create"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
           project: project,
           params: params
        }
    }

    return axios(config)
}

export function getTestRuns(projectId) {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testRuns/${projectId}`),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}