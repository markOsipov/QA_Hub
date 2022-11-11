const axios = require('axios');

export function getBlockedTests(project) {
    console.log(process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/blocker/" + project))

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