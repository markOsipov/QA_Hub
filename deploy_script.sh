#/bin/bash

#README: 
#Before the first usage:
#Install Docker
#Generate a ssh key: ssh-keygen -t ed25519 -C "user@email.com"
#Push the public key on target host: ssh-copy-id username@123.123.123.123
#Give this script rights to be executed: chmod +x <file_name>

#Your local sudo password
LOCAL_PASSWORD=$LOCAL_PASSWORD

#Docker credentials
DOCKER_APP_PATH=/Applications/Docker.app
DOCKER_LOGIN=$DOCKER_LOGIN
DOCKER_PASSWORD=$DOCKER_PASSWORD
DOCKER_SPACE=$DOCKER_SPACE

#Target host credentials
REMOTE_IP=$REMOTE_IP
REMOTE_USER=$REMOTE_USER
REMOTE_PASSWORD=$REMOTE_PASSWORD

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
    sudo docker run -d -p 8080:8080 --name qa_hub_backend "$DOCKER_SPACE"/qa_hub_backend:latest && \
    sudo docker rmi --force $(sudo docker images | grep qa_hub_backend | grep none | awk '{print $3}') || true && \
    echo qa_hub_backend HAS BEEN SUCCESSFULLY UPDATED || echo qa_hub_backend HAS FAILED TO UPDATE

    echo "\n"

    sudo docker stop qa_hub_frontend 1>/dev/null || true
    sudo docker rm qa_hub_frontend 1>/dev/null || true
    sudo docker pull "$DOCKER_SPACE"/qa_hub_frontend:latest || echo FAILED TO PULL qa_hub_frontend && \
    sudo docker run -d -p 3000:3000 --name qa_hub_frontend "$DOCKER_SPACE"/qa_hub_frontend:latest && \
    sudo docker rmi --force $(sudo docker images | grep qa_hub_frontend | grep none | awk '{print $3}') || true && \
    echo qa_hub_frontend HAS BEEN SUCCESSFULLY UPDATED || echo qa_hub_frontend HAS FAILED TO UPDATE

    exit
EOF
