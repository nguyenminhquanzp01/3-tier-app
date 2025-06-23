pipeline {
  agent any

  environment {
    IMAGE_NAME = "nguyenminhquanzp01/3-tier-app"
    IMAGE_TAG = "${BUILD_NUMBER}"
    FULL_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"
    CONFIG_REPO = "git@github.com:nguyenminhquanzp01/3-tier-app-cicd.git"
  }

  stages {
    stage('Build Docker Image') {
      steps {
        echo "Building Docker image..."
        sh "docker build -t ${FULL_IMAGE} ./backend"
      }
    }

    stage('Push to Docker Hub') {
      steps {
        echo "Logging in and pushing to Docker Hub..."
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh """
            echo $PASS | docker login -u $USER --password-stdin
            docker push ${FULL_IMAGE}
          """
        }
      }
    }

    stage('Update ArgoCD values') {
  steps {
    sshagent(['git-ssh-key']) {
      sh """
        rm -rf 3-tier-app-cicd
        git clone git@github.com:nguyenminhquanzp01/3-tier-app-cicd.git
        cd 3-tier-app-cicd
        sed -i 's/tag: \".*\"/tag: \"${BUILD_NUMBER}\"/' values.yaml
        git config user.name jenkins
        git config user.email jenkins@ci
        git commit -am "Update image tag to ${BUILD_NUMBER}"
        git push
      """
    }
  }
}

  }
}
