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
    }
}
