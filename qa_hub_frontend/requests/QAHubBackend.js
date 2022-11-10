const axios = require('axios');

export function getBlockedTests(project) {
    console.log(process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/blocker/" + project))

    const config = {
        method: 'get',
        url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/blocker/" + project),
        //url: "http://127.0.0.1:8080/api/blocker/" + project,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return axios(config)
}