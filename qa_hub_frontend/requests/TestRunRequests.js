import process from "../next.config";
import axios from "axios";

export function startNewTestRun(projectId, params) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/testRuns/start"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
           projectId: projectId,
           params: params
        }
    }

    return axios(config)
}