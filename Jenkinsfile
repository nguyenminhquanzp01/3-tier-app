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

    stage('Update ArgoCD Config') {
      steps {
        echo "Cloning and updating ArgoCD values.yaml..."
        sshagent(['git-ssh-key']) {
          sh """
            git clone ${CONFIG_REPO}
            cd 3-tier-app-cicd
            yq e '.image.tag = "${IMAGE_TAG}"' -i values.yaml
            git config user.name jenkins
            git config user.email jenkins@ci
            git add values.yaml
            git commit -m "Update image tag to ${IMAGE_TAG}"
            git push
          """
        }
      }
    }
  }
}
