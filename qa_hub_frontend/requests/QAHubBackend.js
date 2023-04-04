const axios = require('axios');

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

export function loadProjects() {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/projects"),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function createProject(project) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/projects/create"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: project
    }

    return axios(config)
}

export function updateProject(project) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/projects/update"),
        headers: {
            'Content-Type': 'application/json'
        },
        data: project
    }

    return axios(config)
}

export function deleteProject(projectName) {
    const config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/projects/${projectName}/delete`),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

export function loadPlatforms() {
    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/platforms"),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios(config)
}

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