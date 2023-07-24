import process from "../../next.config";
import axios from "axios";

export function getTestResults(testRunId, filter, skip, limit) {
  const config = {
    method: 'post',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testResults/${testRunId}`),
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

export function getTestRetries(testRunId, fullName) {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testResults/retries`),
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      testRunId: testRunId,
      fullName: fullName
    }
  }

  return axios(config)
}