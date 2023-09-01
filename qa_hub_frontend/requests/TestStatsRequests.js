import process from "../next.config";
import axios from "axios";

export function getTestStats(project, filter, skip, limit , sort) {
  const config = {
    method: 'post',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/stats"),
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      project: project,
      filter: filter,
      pagination: {
        skip: skip || 0,
        limit: limit || 0
      },
      sort: sort
    }
  }

  return axios(config)
}

export function getTestHistory(project, testcaseId, filter) {
  const config = {
    method: 'post',
    url: process.env.NEXT_PUBLIC_QA_HUB_BACKEND.concat("/api/stats/history"),
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      project: project,
      testcaseId: testcaseId,
      filter: filter
    }
  }

  return axios(config)
}