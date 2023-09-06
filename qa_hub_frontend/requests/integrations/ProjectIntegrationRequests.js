import process from "../../next.config";
import axios from "axios";

export function getCicdIntegration(project) {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/cicd/" + project),
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

export function getTaskTmsIntegration(project) {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/tms/" + project),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return axios(config)
}

export function getAllProjectIntegrations(project) {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/integrations/" + project),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return axios(config)
}