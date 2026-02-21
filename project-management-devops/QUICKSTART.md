# Quick Start & Validation Report

## Local Development Setup

```bash
# Install Node dependencies
make bootstrap

# Start Docker services (PostgreSQL, backend, frontend)
bash scripts/compose.sh up

# View logs
bash scripts/compose.sh logs

# Stop services
bash scripts/compose.sh down
```

## Service Access

- **Frontend:** http://localhost:80 (NGINX serving React SPA)
- **Backend API:** http://localhost:3000 (Node.js + Express)
- **Health Check:** http://localhost:3000/health
- **Database:** localhost:5432 (PostgreSQL, creds: app_user / local_password)

## Test Application Flow

```bash
# 1. Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123","fullName":"John Doe"}'

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'

# Response: {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

# 3. Create project (use token from login)
TOKEN="<paste-token-here>"
curl -X POST http://localhost:3000/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Test project"}'

# 4. List projects
curl -X GET http://localhost:3000/projects \
  -H "Authorization: Bearer $TOKEN"
```

## Database Schema

The PostgreSQL database is automatically initialized with the schema from `sql/schema.sql`:

- **users**: User accounts with bcrypt-hashed passwords
- **projects**: Project metadata with owner references
- **tasks**: Individual tasks within projects
- **comments**: Task-level discussions
- **attachments**: S3 file references

All tables use UUID primary keys and timestamps. Foreign keys enforce data integrity.

## CI/CD Pipeline

The GitHub Actions workflow in `.github/workflows/ci-cd.yml` implements:

1. **Lint & Test**: Node.js code quality checks
2. **Build**: Docker multi-stage builds for backend and frontend
3. **Push**: Images pushed to ECR (requires secrets configured)
4. **Deploy**: Terraform applies infrastructure changes
5. **Invalidate**: CloudFront cache refreshed

**Required GitHub Secrets:**

```
AWS_ROLE_ARN                    (OIDC role for GitHub Actions)
ECR_BACKEND_REPO                (ECR repository name)
DB_PASSWORD                     (RDS master password)
JWT_SECRET                      (Token signing secret)
ACM_CERT_ARN                    (TLS certificate ARN)
ACCOUNT_SUFFIX                  (AWS account ID)
BACKEND_ECR_IMAGE               (Full ECR image URI)
DATABASE_URL                    (RDS connection string)
FRONTEND_S3_BUCKET              (S3 frontend bucket name)
CLOUDFRONT_DISTRIBUTION_ID      (CloudFront distribution ID)
```

## Terraform Deployment

```bash
# Local development (uses local state)
cd infra/terraform
terraform init
terraform plan -var-file=../environments/prod.tfvars

# Production (configure backend first!)
# Uncomment backend block in backend.tf with S3 credentials
terraform apply -var-file=../environments/prod.tfvars
```

**Required Terraform Variables** (see `infra/environments/prod.tfvars`):

- `acm_certificate_arn`: AWS Certificate Manager certificate
- `app_ami_id`: AMI ID for EC2 instances (e.g., Ubuntu 22.04 LTS)
- `backend_ecr_image`: ECR image URI
- `database_url`: RDS connection string
- `jwt_secret`: JWT signing secret (sensitive)
- `db_password`: RDS master password (sensitive)
- `account_suffix`: AWS account ID for globally unique bucket names

## Security Checklist

- ✅ RDS in private subnets, encryption at rest enabled
- ✅ EC2 instances in private subnets, no public IPs
- ✅ API Gateway + ALB for ingress control
- ✅ TLS/HTTPS via ACM certificate
- ✅ JWT authentication with bcrypt hashing
- ✅ S3 buckets: public access blocked, HTTPS-only policies
- ✅ Security groups: least privilege rules
- ✅ IAM roles: restricted EC2 permissions
- ✅ CloudWatch alarms: CPU, memory, database connections

## Validation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Terraform HCL | ✅ Valid | Local state mode for dev |
| Docker Compose | ✅ Valid | Updated with health checks |
| Node.js Syntax | ✅ Valid | Backend app.js checked |
| Schema SQL | ✅ Valid | Ready for PostgreSQL 16+ |

## Monitoring & Logging

Real-time observability is built in:

- **Structured Logs**: JSON format from Pino logger
- **CloudWatch Logs**: Auto-forwarded from EC2 instances
- **Health Endpoint**: `/health` returns database status
- **Alarms**: CPU (75%), memory (80%), RDS connections (200+)

Example structured log:

```json
{
  "msg": "User registered",
  "req": {
    "method": "POST",
    "url": "/auth/register",
    "statusCode": 201
  },
  "responseTime": 145,
  "timestamp": "2026-02-21T12:34:56Z"
}
```

## Disaster Recovery

- **Backups**: RDS 14-day automated backups with PITR
- **Storage**: S3 versioning enabled for all buckets
- **Failover**: Multi-AZ RDS automatic failover
- **Infrastructure**: Terraform-driven reproducibility

See `docs/disaster-recovery.md` for regional failover runbooks.

## Deployment Patterns

### Rolling Deployment (Default)

```bash
# Update backend Docker image in prod.tfvars
# ASG gradually replaces instances with new launch template
terraform apply -var-file=../environments/prod.tfvars
```

### Blue-Green Deployment (High-Risk)

1. Create second ASG with new image (green)
2. Run smoke tests against green environment
3. Switch ALB listener to green target group
4. Observe metrics for 15 minutes
5. Decommission blue ASG if stable

## Cost Optimization

Default resource sizing for development:

- **EC2**: t3.medium (2 vCPU, 4GB RAM) - ASG min 2, max 6
- **RDS**: db.t4g.medium (2 vCPU, 4GB RAM) - Multi-AZ
- **Storage**: 100GB allocated, 500GB max for RDS auto-scaling
- **Data Transfer**: Minimal (internal VPC traffic)

**Estimated Monthly Cost (AWS us-east-1):**

- EC2 (2 instances, t3.medium): ~$60
- RDS (db.t4g.medium, Multi-AZ): ~$80
- NAT Gateway: ~$45
- ALB: ~$22
- S3 + CloudFront: ~$5 (low volume)
- **Total**: ~$210/month (excludes data transfer)

Use AWS Cost Explorer and tagging strategy (Project, Environment, Owner, CostCenter) for accurate chargeback.

## Next Steps

1. Configure GitHub secrets with AWS IAM OIDC role
2. Create ACM certificate for your domain
3. Prepare EC2 AMI or use latest Ubuntu 22.04 LTS
4. Update `prod.tfvars` with your AWS account values
5. Run `make tf-apply` to deploy infrastructure
6. Monitor CloudWatch dashboard during first week

## Support & References

- **Terraform Docs**: https://registry.terraform.io/providers/hashicorp/aws/latest/docs
- **AWS Best Practices**: https://aws.amazon.com/architecture/well-architected/
- **Express.js Security**: https://expressjs.com/en/advanced/best-practice-security.html
- **PostgreSQL on RDS**: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html
