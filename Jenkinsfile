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
    imagePullPolicy: Always
    command:
    - cat
    tty: true
    resources:
      requests:
        cpu: "500m"
        memory: "1Gi"
      limits:
        cpu: "1"
        memory: "2Gi"
    volumeMounts:
      - name: docker-config
        mountPath: /kaniko/.docker
  volumes:
  - name: docker-config
    projected:
      sources:
        - secret:
            name: docker-config
            items:
              - key: .dockerconfigjson
                path: config.json
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
        script {
          try {
            sh '''
              /kaniko/executor \
                --context `pwd` \
                --dockerfile `pwd`/Dockerfile \
                --destination=$IMAGE \
                --cache=true \
                --skip-tls-verify
            '''
          } catch (e) {
            error("Failed to build and push image: ${e.getMessage()}")
          }
        }
      }
    }

    stage('Update ArgoCD values') {
      when {
        expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
      }
      steps {
        sshagent(['git-ssh-key']) {
          script {
            try {
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
            } catch (e) {
              error("Failed to update ArgoCD values: ${e.getMessage()}")
            }
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}