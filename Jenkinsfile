pipeline {
  agent any

  environment {
    IMAGE = "nguyenminhquanzp01/3-tier-app:${BUILD_NUMBER}"
    CONFIG_REPO = "git@github.com:nguyenminhquanzp01/3-tier-app-cicd.git"
  }

  stages {
    stage('Build') {
      steps {
        sh "docker build -t $IMAGE ."
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh "echo $PASS | docker login -u $USER --password-stdin"
          sh "docker push $IMAGE"
        }
      }
    }

    stage('Update ArgoCD values') {
      steps {
        sshagent(['git-ssh-key']) {
          sh """
            git clone $CONFIG_REPO
            cd 3-tier-app-cicd
            yq e '.image.tag = "${BUILD_NUMBER}"' -i values.yaml
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
