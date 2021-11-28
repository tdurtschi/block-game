pipeline {
    agent any

    stages {
        stage('Check pipeline dependencies') {
            steps {
                sh "yarn -v"
                sh "node -v"
            }
        }
        
        stage('Install dependencies') {
            steps {
                sh "yarn install"
            }
        }

        stage('Run tests') {
            steps {
                sh "yarn test"
            }
        }

        stage('Deploy UI') {
            steps {
                sh "echo 'todo'"
            }
        }
    
        stage('Deploy Backend') {
            steps {
                sh "echo 'todo'"
            }
        }
    }
}

