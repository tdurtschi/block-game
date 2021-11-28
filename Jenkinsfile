pipeline {
    agent any

    stages {
        stage('Install dependencies') {
            steps {
                sh "npm install"
            }
        }

        stage('Run tests') {
            steps {
                sh "npm test"
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

