#/bin/bash

#README: 
#Before the first usage:
#Install Docker
#Generate a ssh key: ssh-keygen -t ed25519 -C "user@email.com"
#Push the public key on target host: ssh-copy-id username@123.123.123.123
#Give this script rights to be executed: chmod +x <file_name>

#Your local sudo password
LOCAL_PASSWORD=VWfXjmCp445

#Docker credentials
DOCKER_APP_PATH=/Applications/Docker.app
DOCKER_LOGIN=dev@lowkeychat.com
DOCKER_PASSWORD=kisbef-towja9-rasRuv
DOCKER_SPACE=teamlowkey

#Target host credentials
REMOTE_IP="123.123.123.123"
REMOTE_USER=devops3
REMOTE_PASSWORD=lowkey

#ENVs passing into containers
ENV_MONGO_QA_HUB_HOST='mongodb://23.123.123.123:27017'
ENV_MONGO_QA_HUB_LOGIN=""
ENV_MONGO_QA_HUB_PASSWORD=""
ENV_MONGO_QA_HUB_AUTH_SOURCE=""
NEXT_PUBLIC_QA_HUB_BACKEND='http://23.123.123.123:8080'

SCRIPT_DIR=$(dirname "$(realpath $0)")

function build_and_push_image() {
    DOCKER_IMAGE=$1
    echo "\nBUILDING DOCKER IMAGE $DOCKER_IMAGE" && sudo docker-compose build 1>/dev/null
    echo "SETTING THE TAG" && sudo docker tag qa_hub_backend:latest $DOCKER_SPACE/qa_hub_backend:latest 1>/dev/null
    echo "PUSHING THE IMAGE" && sudo docker push $DOCKER_SPACE/qa_hub_backend:latest 1>/dev/null
    echo "DOCKER IMAGE $DOCKER_IMAGE HAS BEEN UPDATED"
}

function update_image() {
    IMAGE=$1
    cd $SCRIPT_DIR/$IMAGE
    build_and_push_image $IMAGE || echo "UPDATING DOCKER IMAGE $IMAGE HAS FAILED"
}

sudo -S <<< "$LOCAL_PASSWORD" rm ~/.docker/config.json
open $DOCKER_APP_PATH
docker login --username=$DOCKER_LOGIN --password=$DOCKER_PASSWORD

update_image qa_hub_backend
update_image qa_hub_frontend

echo "\nDEPLOYING IMAGES"
ssh $REMOTE_USER@$REMOTE_IP << EOF
    sudo -S <<< "$REMOTE_PASSWORD" rm ~/.docker/config.json
    security unlock-keychain -p "$REMOTE_PASSWORD"
    sudo docker login --username="$DOCKER_LOGIN" --password="$DOCKER_PASSWORD"

    sudo docker stop qa_hub_backend 1>/dev/null || true
    sudo docker rm qa_hub_backend 1>/dev/null || true
    sudo docker pull "$DOCKER_SPACE"/qa_hub_backend:latest || echo FAILED TO PULL qa_hub_backend && \
    sudo docker run -d -p 8080:8080 --name qa_hub_backend \
     -e ENV_MONGO_QA_HUB_HOST="$ENV_MONGO_QA_HUB_HOST" \
     -e ENV_MONGO_QA_HUB_LOGIN="ENV_MONGO_QA_HUB_LOGIN" \
     -e ENV_MONGO_QA_HUB_PASSWORD="ENV_MONGO_QA_HUB_PASSWORD" \
     -e ENV_MONGO_QA_HUB_AUTH_SOURCE="ENV_MONGO_QA_HUB_AUTH_SOURCE" \
     "$DOCKER_SPACE"/qa_hub_backend:latest && \
    sudo docker rmi --force $(sudo docker images | grep qa_hub_backend | grep none | awk '{print $3}') || true && \
    echo qa_hub_backend HAS BEEN SUCCESSFULLY UPDATED || echo qa_hub_backend HAS FAILED TO UPDATE

    echo "\n"

    sudo docker stop qa_hub_frontend 1>/dev/null || true
    sudo docker rm qa_hub_frontend 1>/dev/null || true
    sudo docker pull "$DOCKER_SPACE"/qa_hub_frontend:latest || echo FAILED TO PULL qa_hub_frontend && \
    sudo docker run -d -p 3000:3000 --name qa_hub_frontend \
    -e NEXT_PUBLIC_QA_HUB_BACKEND="$NEXT_PUBLIC_QA_HUB_BACKEND" \
    "$DOCKER_SPACE"/qa_hub_frontend:latest && \
    sudo docker rmi --force $(sudo docker images | grep qa_hub_frontend | grep none | awk '{print $3}') || true && \
    echo qa_hub_frontend HAS BEEN SUCCESSFULLY UPDATED || echo qa_hub_frontend HAS FAILED TO UPDATE

    exit
EOF
