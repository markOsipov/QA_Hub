import axios from "axios";
import process from "../../next.config";

export function getTaskTrackerTypes() {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/taskTracker/types"),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return axios(config)
}

export function getTaskTrackerIntegrations() {
  const config = {
    method: 'get',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/taskTracker/integrations"),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return axios(config)
}

export function addTaskTrackerIntegration(cicd) {
  const config = {
    method: 'post',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/taskTracker/integrations/add"),
    headers: {
      'Content-Type': 'application/json'
    },
    data: cicd
  }

  return axios(config)
}

export function updateTaskTrackerIntegration(cicd) {
  const config = {
    method: 'post',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/taskTracker/integrations/update"),
    headers: {
      'Content-Type': 'application/json'
    },
    data: cicd
  }

  return axios(config)
}

export function deleteTaskTrackerIntegration(cicdId) {
  const config = {
    method: 'post',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat(`/api/taskTracker/integrations/delete/${cicdId}`),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return axios(config)
}