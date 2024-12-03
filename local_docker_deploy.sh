#/bin/bash
docker stop qa_hub_backend && docker rm qa_hub_backend && docker rmi qa_hub_backend
docker stop qa_hub_frontend && docker rm qa_hub_frontend && docker rmi qa_hub_frontend
docker-compose up -d