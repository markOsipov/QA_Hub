import axios from "axios"

export function getTestAttachments(testRunId, fullName, retry) {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/attachments`),
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      testRunId: testRunId,
      fullName: fullName,
      retry: retry
    }
  }

  return axios(config)
}

export function getAttachment(uri) {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(uri),
  }

  return axios(config)
}