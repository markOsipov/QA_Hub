# How to run:

##
## Backend:
###1. Run mongodb instance
Create database with name dbQaHub

####
### 2. Setup environmental variables:
ENV_MONGO_QA_HUB_HOST  \
ENV_MONGO_QA_HUB_LOGIN  \
ENV_MONGO_QA_HUB_PASSWORD \

used for local launch or for docker compose build

### Local Launch:
1. Create and set permissions for logs directory \
sudo mkdir /var/log/qa_hub \
sudo touch /var/log/qa_hub/application.log
sudo touch /var/log/qa_hub/application_json.log \
sudo chmod 777 /var/log/qa_hub/application.log \
sudo chmod 777 /var/log/qa_hub/application_json.log \
sudo chmod -R 777 /var/log/qa_hub

2. Install JDK 1.8+
3. Build project

### Launch in Docker:
#### Create env file in .config directory and set env's from previous step
example of env-file can be found in .config/env-example

###
#### Build docker image
cd qa_hub_backend \
sudo docker-compose build

###
#### Run docker container(Docker should be started on your machine)
sudo docker-compose --env-file ../.config/env up -d \
(--env-file is path to the file from step 3)

## Frontend:
####
### Preparation:
brew install npm

### Local launch: 
cd qa_hub_frontend \
npm install \
npm run build \
npm run start_local

### Local launch in dev mode:
cd qa_hub_frontend \
npm install \
npm run dev

in dev mode all pages would rerender on each request, all static props also would be requested.

### Launch in Docker:
#### 1. Build docker image
cd qa_hub_frontend \
sudo docker-compose build

#### 2. Run docker container(Docker should be started on your machine)
sudo docker-compose up -d


# Important
Some files have been marked as unchangeable (could be deploy-script or config files)
To make them trackable again:
git update-index ---no-assume-unchanged ./path/to/file

To stop tracking changes again:
git update-index ---assume-unchanged ./path/to/file