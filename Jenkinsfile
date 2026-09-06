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
                sh 'docker build -t pokemon-universe:jenkins .'
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
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker tag pokemon-universe:jenkins $DOCKER_USERNAME/pokemon-universe:latest
                        docker push $DOCKER_USERNAME/pokemon-universe:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Test EC2 SSH') {
            steps {
                sshagent(credentials: ['ec2-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@13.201.137.160 \
                        "echo 'Jenkins successfully connected to EC2'"
                    '''
                }
            }
        }
    }
}
