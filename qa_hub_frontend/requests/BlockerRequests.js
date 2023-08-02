import axios from "axios";
import process from "../next.config";

export function getBlockedTests(project) {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/blocker/" + project),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function getTaskTrackerIntegration(project) {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/taskTracker/" + project),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function getTaskStatus(project, task) {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/blocker/${project}/taskStatus/${task}`),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function unblockTest(blockedTest) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/blocker/unblock"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: blockedTest
    }

    return axios(config)
}

export function blockTest(blockedTest) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/blocker/block"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: blockedTest
    }

    return axios(config)
}

export function editBlockedTest(blockedTest) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/blocker/edit"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: blockedTest
    }

    return axios(config)
}