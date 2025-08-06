# 🏗️ Employee Info Multi-Tier Application Containerization on Docker and Deployment on GKE

This assignment demonstrates:\
    1. Developing simple multi-tier application (Node.js API + MongoDB)\
    2. Containerize the application using Docker and push on Docker Hub\
    3. Deploy the application on **Google Kubernetes Engine (GKE)**.

---

## 📦 Tech Stack

- **Node.js (Express.js)**: REST API microservice
- **MongoDB**: Backend database
- **Docker**: Containerization
- **Kubernetes (GKE)**: Deployment
- **Ingress (GCE)**: External access to the API
- **ConfigMap & Secrets**: Externalized configs
- **Persistent Volume (GCE Disk)**: Persistent storage for MongoDB

---

## 🧰 Prerequisites

- Google Cloud SDK installed & authenticated
- GCP Project with billing enabled
- Docker installed
- `kubectl` configured

---

## 🧰 File Structure\

employee_info-multi-tier-app/\
│\
├── app/\
│   ├── index.js\
│   ├── package.json\
│   └── Dockerfile\
│\
├── k8s/\
│   ├── employeeInfo-app-configmap.yml\
│   ├── employeeInfo-app-deployment.yml\
│   ├── employeeInfo-app-service.yml\
│   ├── ingress.yml\
│   ├── mongo-db-deployment.yml\
│   ├── mongo-db-pv.yml\
│   ├── mongo-db-secrets.yml\
│   ├── mongo-db-service.yml\
│   └── mongo-db-storage.yml\
│\
└── README.md

---

## Deliverables
GitHub URL: https://github.com/vishal-1989/employee_info-multi-tier-app.git\
Docker URL: https://hub.docker.com/repository/docker/vishalagg90/employeeinfo-app/general\
Service tier API URL: http://34.100.218.62/employeesInfo\
Recording: https://nagarro-my.sharepoint.com/:v:/p/vishal_aggarwal04/Ee91miHLAvFNpk3T01mGKeMBBUdiaKmI-4ViAb3XCLuBzA
---

## ⚙️ Step-by-Step Setup

### 1. Clone This Repo
```bash
git clone https://github.com/vishal-1989/employee_info-multi-tier-app.git
cd employee_info-multi-tier-app
```

### 2. Build and push docker image
```bash
cd app
docker build -t vishalagg90/employeeinfo-app:v3 .
docker push vishalagg90/employeeinfo-app:v2
```

### 3. Create GKE autopilot cluster
```bash
```

### 4. Create Persistent disk for MongoDB
```bash
gcloud compute disks create mongo-db-disk \
	  --size=200GB \
	  --type=pd-standard \
	  --region=us-central1 \
	  --replica-zones=us-central1-a,us-central1-b
```

### 5. Upload kubernetes manifests in k8s folder
```bash
cd k8s
```
Upload following YAML files:\
[employeeInfo-app-configmap.yml]\
[employeeInfo-app-deployment.yml]\
[employeeInfo-app-service.yml]\
[ingress.yml]\
[mongo-db-deployment.yml]\
[mongo-db-pv.yml]\
[mongo-db-pvc.yml]\
[mongo-db-secrets.yml]\
[mongo-db-service.yml]\
[mongo-db-storage.yml]

### 6. Create secrets
```bash
kubectl apply -f mongo-db-secrets.yml
kubectl describe Secret mongo-db-secret
```

### 7. Create storage
```bash
kubectl apply -f mongo-db-storage.yml
kubectl describe storageclass mongo-db-storage
```

### 8. Create persistent volume claim
```bash
kubectl apply -f mongo-db-pvc.yml
kubectl describe pvc mongo-db-pvc
```

### 9.  Deploy Mongo DB
```bash
kubectl apply -f mongo-db-deployment.yml
kubectl describe deployment mongo-db
kubectl get pods
```

### 10.  Deploy Mongo DB Service
```bash
kubectl apply -f mongo-db-service.yml
kubectl describe service mongo-db-service
kubectl get service mongo-db-service
```

### 11.  Deploy ConfigMap
```bash
kubectl apply -f employeeInfo-app-configmap.yml
kubectl describe ConfigMap employeeinfo-app-config
```

### 12.  Deploy Node.js application
```bash
kubectl apply -f employeeInfo-app-deployment.yml
kubectl describe deployment employeeinfo-app
kubectl get pods
```

### 13.  Deploy application service
```bash
kubectl apply -f employeeInfo-app-service.yml
kubectl describe service employeeinfo-app-service
kubectl get service employeeinfo-app-service
```

### 14.  Create Ingress Controller & Expose Service 
```bash
kubectl apply -f ingress.yml
kubectl describe ingress employeeinfo-app-ingress
kubectl get ingress employeeinfo-app-ingress
```

Note: It may take 2–3 minutes to assign an external IP to the Ingress.

### 15.  Test the API
```bash
curl http://34.100.218.62/employeesInfo
```
**Note: External IP is referred from my demo

### 16.  Resiliency Test application pod (Rolling Update)
```bash
kubectl delete pod employeeinfo-app-f5f846447-7dwqv
```
Pods will auto-recreate
**Note: Pod name is referred from my demo

### 17.  Resiliency Test DB pod
```bash
kubectl delete pod mongo-db-75cf9784cf-d6qvq
```
Pods will auto-recreate
**Note: Pod name is referred from my demo

---








