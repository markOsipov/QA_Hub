# How to run:

##
## Backend:
###1. Run mongodb instance
Create database with name dbQaHub

###
###2. Setup environmental variables:
ENV_MONGO_QA_HUB_HOST  
ENV_MONGO_QA_HUB_LOGIN  
ENV_MONGO_QA_HUB_PASSWORD

used for local launch or for docker compose build

###
###3. Create env file and set env's from previous step


###
###4. Build docker image
pwd is qa_hub_backend:
sudo docker-compose build

###
###5. Run docker container
--env-file is path to the file from step 3
sudo docker-compose --env-file ../.config/env up -d

## 
##  Frontend:
pwd is qa_hub_frontend

#
####For local dev launch:
npm run dev
#
####For local launch: 
npm run build \
npm run start_local
