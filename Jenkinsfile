pipeline {
  agent any

  environment {
    IMAGE_TAG = "${BUILD_NUMBER}"
    CONFIG_REPO = "git@github.com:nguyenminhquanzp01/3-tier-app-cicd.git"
  }

  stages {
    stage('Build with Compose') {
      steps {
        sh """
          docker-compose build --no-cache backend
          docker tag 3-tier-app_backend:latest nguyenminhquanzp01/3-tier-app:${IMAGE_TAG}
        """
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh """
            echo $PASS | docker login -u $USER --password-stdin
            docker push nguyenminhquanzp01/3-tier-app:${IMAGE_TAG}
          """
        }
      }
    }

    stage('Update ArgoCD Config') {
      steps {
        sshagent(['git-ssh-key']) {
          sh """
            git clone $CONFIG_REPO
            cd 3-tier-app-cicd
            yq e '.image.tag = "${IMAGE_TAG}"' -i values.yaml
            git config user.name jenkins
            git config user.email jenkins@ci
            git commit -am "update image tag ${IMAGE_TAG}"
            git push
          """
        }
      }
    }
  }
}
