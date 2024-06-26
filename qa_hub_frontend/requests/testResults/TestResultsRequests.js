import process from "../../next.config";
import axios from "axios";

export function getSingleTestResult(testRunId, identifier) {
  const config = {
    method: 'post',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testResults/single`),
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      testRunId: testRunId,
      identifier: identifier
    }
  }

  return axios(config)
}

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

export function countTestResults(testRunId, filter) {
  const config = {
    method: 'post',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testResults/count/${testRunId}`),
    headers: {
      'Content-Type': 'application/json'
    },
    data: filter
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

export function getTimelineData(testRunId) {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testResults/timeline/${testRunId}`),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return axios(config)
}