import process from "../../next.config";
import axios from "axios";

export function getTestLogs(testRunId, fullName, retry) {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testResults/log`),
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