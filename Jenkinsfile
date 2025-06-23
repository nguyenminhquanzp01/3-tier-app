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
    image: gcr.io/kaniko-project/executor:debug  // Sử dụng image debug thay vì latest
    command: ["/busybox/sleep"]  // Sử dụng sleep từ busybox
    args: ["9999999"]
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
        container('kaniko') {  // Thêm container context
          script {
            sh '''
              /kaniko/executor \
                --context `pwd` \
                --dockerfile `pwd`/Dockerfile \
                --destination=$IMAGE \
                --skip-tls-verify
            '''
          }
        }
      }
    }

    stage('Update ArgoCD values') {
      steps {
        sshagent(['git-ssh-key-config']) {
          script {  // Thêm script block
            sh '''
              git clone $CONFIG_REPO
              cd 3-tier-app-cicd
              yq e '.image.tag = "${BUILD_NUMBER}"' -i values.yaml
              git config user.name "Jenkins CI"
              git config user.email "jenkins@ci.example.com"
              git add values.yaml
              git commit -m "Update image tag to ${BUILD_NUMBER}"
              git push origin HEAD
            '''
          }
        }
      }
    }
  }
}