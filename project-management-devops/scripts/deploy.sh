#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="infra/environments/prod.tfvars"

cd infra/terraform
terraform init
terraform plan -var-file="../environments/prod.tfvars"
terraform apply -auto-approve -var-file="../environments/prod.tfvars"

cd ../../frontend
npm ci
npm run build
aws s3 sync dist/ "s3://${FRONTEND_S3_BUCKET}" --delete

echo "Deployment completed"