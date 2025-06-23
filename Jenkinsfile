pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: jenkins-kaniko
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    command:
    - cat
    tty: true
    volumeMounts:
      - name: docker-config
        mountPath: /kaniko/.docker
  volumes:
  - name: docker-config
    projected:
      sources:
        - secret:
            name: docker-config
"""
      defaultContainer 'kaniko'
    }
  }

  environment {
    IMAGE = "nguyenminhquanzp01/3-tier-app:${BUILD_NUMBER}"
    CONFIG_REPO = "git@github.com:nguyenminhquanzp01/3-tier-app-cicd.git"
  }

  stages {
    stage('Build and Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            mkdir -p /kaniko/.docker
            echo "{\"auths\":{\"https://index.docker.io/v1/\":{\"username\":\"$DOCKER_USER\",\"password\":\"$DOCKER_PASS\"}}}" > /kaniko/.docker/config.json

            /kaniko/executor \
              --context `pwd` \
              --dockerfile `pwd`/Dockerfile \
              --destination=$IMAGE \
              --skip-tls-verify
          '''
        }
      }
    }

    stage('Update ArgoCD values') {
      steps {
        sshagent(['git-ssh-key']) {
          sh '''
            git clone $CONFIG_REPO
            cd 3-tier-app-cicd
            yq e '.image.tag = "${BUILD_NUMBER}"' -i values.yaml
            git config user.name jenkins
            git config user.email jenkins@ci
            git commit -am "Update image tag to ${BUILD_NUMBER}"
            git push
          '''
        }
      }
    }
  }
}
