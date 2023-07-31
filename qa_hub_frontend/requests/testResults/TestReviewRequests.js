import process from "../../next.config";
import axios from "axios";

export function getQaReview(testRunId, fullName) {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testResults/review`),
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

export function postQaReview(testRunId, fullName, qaComment, qaResolution) {
  const config = {
    method: 'post',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/testResults/review`),
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      testRunId: testRunId,
      fullName: fullName,
      qaComment: qaComment,
      qaResolution: qaResolution
    }
  }

  return axios(config)
}