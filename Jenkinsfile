pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        IMAGE_NAME = 'redquantaris/rak-airport'
        CONTAINER_NAME = 'rak-airport'
        APP_PORT = '8082'

        DOCKER_CREDENTIALS_ID = 'docker'
        GIT_CREDENTIALS_ID = 'redquantaris'
        GIT_REPO = 'https://github.com/Red-Quantaris/rak-airport.git'

        DOMAIN_NAME = 'rakairport.redquantaris.com'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: "${GIT_CREDENTIALS_ID}",
                    url: "${GIT_REPO}"
            }
        }

        stage('Check Source Files') {
            steps {
                sh '''
                    echo "Current workspace:"
                    pwd

                    echo "Project files:"
                    ls -la

                    echo "Checking Dockerfile:"
                    test -f Dockerfile

                    echo "Checking package.json:"
                    test -f package.json

                    echo "Checking nginx.conf:"
                    test -f nginx.conf
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $IMAGE_NAME:$BUILD_NUMBER .
                    docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS_ID}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                    docker push $IMAGE_NAME:$BUILD_NUMBER
                    docker push $IMAGE_NAME:latest
                '''
            }
        }

        stage('Deploy Docker Container') {
            steps {
                sh '''
                    docker pull $IMAGE_NAME:latest

                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true

                    docker run -d \
                      --name $CONTAINER_NAME \
                      --restart unless-stopped \
                      -p 127.0.0.1:$APP_PORT:80 \
                      $IMAGE_NAME:latest
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                    sleep 5

                    echo "Checking container status:"
                    docker ps --filter "name=$CONTAINER_NAME"

                    echo "Testing app from inside container:"
                    docker exec $CONTAINER_NAME sh -c "wget -q -S -O /dev/null http://127.0.0.1 2>&1 | head"

                    echo "Testing from host network using curl container:"
                    docker run --rm --network host curlimages/curl:latest -I http://127.0.0.1:$APP_PORT
                '''
            }
        }
    }

    post {
        success {
            echo 'RAK Airport Docker deployment completed successfully.'
        }

        failure {
            echo 'RAK Airport Docker deployment failed. Check Jenkins console logs.'
        }
    }
}
