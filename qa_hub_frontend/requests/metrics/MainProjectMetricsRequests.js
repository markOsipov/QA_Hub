import process from "../../next.config";
import axios from "axios";

export function getMainProjectMetrics(project) {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/metrics/main/${project}`),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return axios(config)
}

export function updateMetrics(project) {
  const config = {
    method: 'post',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/metrics/main/${project}`),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return axios(config)
}