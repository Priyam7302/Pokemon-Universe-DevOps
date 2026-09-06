pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-ssh',
                    url: 'git@github.com:Priyam7302/Pokemon-Universe-DevOps.git'
            }
        }

        stage('Validate') {
            steps {
                sh '''
                    test -f index.html
                    test -f index.css
                    test -f index.js
                    test -f Dockerfile

                    echo "All required files are present"
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t pokemon-universe:jenkins .
                '''
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {

                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                            -u "$DOCKER_USERNAME" \
                            --password-stdin

                        docker tag pokemon-universe:jenkins \
                            $DOCKER_USERNAME/pokemon-universe:latest

                        docker push \
                            $DOCKER_USERNAME/pokemon-universe:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ['ec2-ssh']) {

                    sh '''
                        ssh -o StrictHostKeyChecking=no \
                            ubuntu@13.201.137.160 <<'EOF'

                            set -e

                            echo "Pulling latest Docker image..."
                            docker pull vadapaav45/pokemon-universe:latest

                            echo "Stopping old container..."
                            docker stop pokemon-universe || true

                            echo "Removing old container..."
                            docker rm pokemon-universe || true

                            echo "Starting new container..."
                            docker run -d \
                                --name pokemon-universe \
                                -p 80:80 \
                                --restart unless-stopped \
                                vadapaav45/pokemon-universe:latest

                            echo "Deployment completed successfully!"

                            echo "Running containers:"
                            docker ps

                        EOF
                    '''
                }
            }
        }
    }
}
