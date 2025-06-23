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
  initContainers:
  - name: init-kaniko
    image: busybox:1.28
    command: ['sh', '-c', 'until [ -f /workspace/ready ]; do sleep 1; done']
    volumeMounts:
    - name: workspace
      mountPath: /workspace

  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    command: ['/kaniko/executor']
    args: [
      '--context=/workspace',
      '--dockerfile=/workspace/Dockerfile',
      '--destination=${IMAGE}',
      '--skip-tls-verify'
    ]
    volumeMounts:
    - name: workspace
      mountPath: /workspace
    - name: docker-config
      mountPath: /kaniko/.docker

  - name: sidecar
    image: busybox:1.28
    command: ['sh', '-c', 'touch /workspace/ready && sleep infinity']
    volumeMounts:
    - name: workspace
      mountPath: /workspace

  volumes:
  - name: workspace
    emptyDir: {}
  - name: docker-config
    secret:
      secretName: docker-config
"""
    }
  }

  environment {
    IMAGE = "nguyenminhquanzp01/3-tier-app:${BUILD_NUMBER}"
  }

  stages {
    stage('Build and Push') {
      steps {
        container('kaniko') {
          script {
            // Kaniko sẽ tự động chạy khi initContainer hoàn thành
            // và sidecar đã tạo file ready
          }
        }
      }
    }
  }
}