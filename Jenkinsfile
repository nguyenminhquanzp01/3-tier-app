pipeline {
  agent any

  environment {
    IMAGE = "nguyenminhquanzp01/3-tier-app:${BUILD_NUMBER}"
    CONFIG_REPO = "git@github.com:nguyenminhquanzp01/3-tier-app-cicd.git"
  }

  stages {
    stage('Build Docker Image') {
      steps {
        sh 'docker build -t $IMAGE .'
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh '''
            echo $PASS | docker login -u $USER --password-stdin
            docker push $IMAGE
          '''
        }
      }
    }

    stage('Update ArgoCD Config') {
      steps {
        sshagent(['git-ssh-key']) {
          sh '''
            git clone $CONFIG_REPO
            cd 3-tier-app-cicd
            yq e '.image.tag = "${BUILD_NUMBER}"' -i values.yaml
            git config user.name jenkins
            git config user.email jenkins@ci
            git commit -am "update image tag to ${BUILD_NUMBER}"
            git push
          '''
        }
      }
    }
  }
}
