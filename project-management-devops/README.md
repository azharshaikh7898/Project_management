# Cloud-Based Project Management Tool (DevOps + AWS)

Production-ready reference implementation of a 3-tier AWS architecture for a cloud project management platform.

## Architecture Overview

- **Presentation Layer**: React frontend built as static assets, stored in S3, delivered via CloudFront.
- **Application Layer**: Node.js + Express API on EC2 instances in an Auto Scaling Group behind an Application Load Balancer, with API Gateway as managed entry point.
- **Data Layer**: Amazon RDS PostgreSQL in private subnets, private S3 bucket for attachments.

## Key Capabilities

- Infrastructure as Code with Terraform (networking, compute, storage, IAM, CDN, database)
- CI/CD with GitHub Actions (lint/test/build/push/deploy/cache invalidation)
- Dockerized frontend and backend (multi-stage builds)
- Secure-by-default controls (least-privilege IAM, private DB, TLS, encryption at rest)
- Observability (CloudWatch logs/metrics, alarms, structured JSON logging, health checks)
- Disaster Recovery (automated RDS backups, cross-region strategy guidance, runbooks)
- Cost optimization and tagging strategy for FinOps governance

## Repository Structure

See project tree at the end of this document and in the repository root.

## Prerequisites

- AWS account and IAM permissions for VPC, EC2, ASG, ALB, API Gateway, RDS, S3, CloudFront, IAM
- Terraform >= 1.6
- Node.js >= 20
- Docker
- GitHub repository secrets configured

## Local Development

```bash
make bootstrap
make up
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health: `http://localhost:3000/health`

## CI/CD Flow

1. Install dependencies
2. Lint and test
3. Build Docker images
4. Push images to ECR
5. Terraform plan/apply
6. CloudFront invalidation

Pipeline definition: `.github/workflows/ci-cd.yml`

## Terraform Deployment

```bash
cd infra/terraform
terraform init
terraform plan -var-file=../environments/prod.tfvars
terraform apply -var-file=../environments/prod.tfvars
```

## Security Highlights

- RDS deployed in private subnets and not publicly accessible
- App instances in private subnets; ingress only via ALB/API Gateway
- TLS termination using ACM certificate on ALB/CloudFront
- JWT authentication + bcrypt password hashing
- S3 encryption, versioning, and private bucket policy
- Security groups restricted by tier

## Observability Highlights

- Structured JSON logs from Node.js app
- CloudWatch log groups for application and infrastructure
- Health endpoint for ALB target checks
- CloudWatch alarms for CPU, memory (custom/agent), and RDS connections

## Disaster Recovery

- Multi-AZ RDS with automated backups and PITR
- S3 versioning and lifecycle policies
- Infrastructure reproducibility via Terraform
- Documented failover and restore runbooks in `docs/disaster-recovery.md`

## Optional Advanced Paths

- Blue/Green and rolling deployment strategy documentation
- ECS/EKS migration path in `docs/devops-strategy.md`
- Multi-region expansion blueprint in `docs/architecture.md`

## Project Tree

```text
project-management-devops/
├── frontend/
├── backend/
├── infra/
│   ├── terraform/
│   ├── modules/
│   └── environments/
├── docker/
├── kubernetes/
├── scripts/
├── sql/
├── docs/
├── diagrams/
├── .github/workflows/
├── README.md
└── Makefile
```