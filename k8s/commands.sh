localstack stop

localstack start -d

# Crear VPC
VPC_ID=$(awslocal ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
echo "VPC creado: $VPC_ID"


# Subnet 1
SUBNET1=$(awslocal ec2 create-subnet \
  --vpc-id "$VPC_ID" \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --query 'Subnet.SubnetId' --output text)
echo "Subnet 1: $SUBNET1"

# Subnet 2
SUBNET2=$(awslocal ec2 create-subnet \
  --vpc-id "$VPC_ID" \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --query 'Subnet.SubnetId' --output text)
echo "Subnet 2: $SUBNET2"

# Crear cluster EKS con load balancer
awslocal eks create-cluster \
  --name product-crud-cluster \
  --role-arn "arn:aws:iam::000000000000:role/eks-role" \
  --resources-vpc-config "subnetIds=$SUBNET1,$SUBNET2" \

# Esperar a que esté ACTIVE (~20 segundos)
awslocal eks wait cluster-active --name product-crud-cluster
echo "✅ Cluster ACTIVE"

# Crear nodegroup
awslocal eks create-nodegroup \
  --cluster-name product-crud-cluster \
  --nodegroup-name main-nodegroup \
  --node-role "arn:aws:iam::000000000000:role/eks-nodegroup-role" \
  --subnets "$SUBNET1" "$SUBNET2" \
  --scaling-config desiredSize=2

# Esperar a que esté ACTIVE (~30 segundos)
awslocal eks wait nodegroup-active \
  --cluster-name product-crud-cluster \
  --nodegroup-name main-nodegroup
echo "✅ Node Group ACTIVE"

# Actualizar kubeconfig
awslocal eks update-kubeconfig \
  --name product-crud-cluster \
  --kubeconfig ~/.kube/config-localstack

# Usar este contexto
export KUBECONFIG=~/.kube/config-localstack
kubectl config use-context arn:aws:eks:us-east-1:000000000000:cluster/product-crud-cluster

# Verificar
kubectl get nodes

# Imagenes ECR

# Backend
BACKEND_URI=$(awslocal ecr create-repository \
  --repository-name product-crud-backend \
  --query 'repository.repositoryUri' --output text 2>/dev/null || \
  awslocal ecr describe-repositories \
  --repository-names product-crud-backend \
  --query 'repositories[0].repositoryUri' --output text)
echo "Backend ECR: $BACKEND_URI"

# Frontend
FRONTEND_URI=$(awslocal ecr create-repository \
  --repository-name product-crud-frontend \
  --query 'repository.repositoryUri' --output text 2>/dev/null || \
  awslocal ecr describe-repositories \
  --repository-names product-crud-frontend \
  --query 'repositories[0].repositoryUri' --output text)
echo "Frontend ECR: $FRONTEND_URI"

# Guardar para usar después
echo "export BACKEND_URI=$BACKEND_URI" > .env-ecr
echo "export FRONTEND_URI=$FRONTEND_URI" >> .env-ecr

source .env-ecr

# Backend (esto toma 3-5 minutos)
docker build -f Dockerfile.backend -t "$BACKEND_URI:latest" .
docker push "$BACKEND_URI:latest"

# Frontend (esto toma 3-5 minutos)
docker build -f Dockerfile.frontend -t "$FRONTEND_URI:latest" .
docker push "$FRONTEND_URI:latest"

# Tag y push backend
docker tag product-crud-backend:latest \
  000000000000.dkr.ecr.us-east-1.localhost.localstack.cloud:4566/product-crud-backend:latest

docker push 000000000000.dkr.ecr.us-east-1.localhost.localstack.cloud:4566/product-crud-backend:latest

# Tag y push frontend
docker tag product-crud-frontend:latest \
  000000000000.dkr.ecr.us-east-1.localhost.localstack.cloud:4566/product-crud-frontend:latest

docker push 000000000000.dkr.ecr.us-east-1.localhost.localstack.cloud:4566/product-crud-frontend:latest

# Verificar
awslocal ecr list-images --repository-name product-crud-backend
awslocal ecr list-images --repository-name product-crud-frontend

# Namespace
kubectl create namespace product-crud

# Secret de BD
kubectl create secret generic db-credentials \
  --from-literal=db-username=postgres \
  --from-literal=db-password=postgres123 \
  -n product-crud

# ConfigMap
kubectl create configmap app-config \
  --from-literal=DATABASE_HOST=postgres \
  --from-literal=DATABASE_PORT=5432 \
  --from-literal=DATABASE_NAME=library_db \
  -n product-crud

# Verificar
kubectl get secrets -n product-crud
kubectl get configmaps -n product-crud


# Aplicar manifiestos
kubectl apply -f k8s/postgres-deployment.yaml -n product-crud
kubectl apply -f k8s/backend-deployment.yaml -n product-crud
kubectl apply -f k8s/backend-service.yaml -n product-crud
kubectl apply -f k8s/frontend-deployment.yaml -n product-crud
kubectl apply -f k8s/frontend-service.yaml -n product-crud

# Crear port-forward para acceder a la app
kubectl port-forward service/frontend 8081:80 -n product-crud

# Comandos utiles para debuggear
kubectl get pods -n product-crud
kubectl get services -n product-crud
docker logs localstack-main 2>&1 | grep -i "eks" | tail -n 20
awslocal eks describe-cluster --name product-crud-cluster --query 'cluster.status'