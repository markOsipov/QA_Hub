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

export function getTestRuns(projectId, filter, skip, limit) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testRuns/${projectId}`),
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            filter: filter,
            pagination: {
                skip: skip || 0,
                limit: limit || 0
            }
        }
    }

    return axios(config)
}

export function getTestRun(testRunId) {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testRuns`),
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            id: testRunId
        }
    }

    return axios(config)
}