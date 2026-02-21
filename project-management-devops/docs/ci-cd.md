# CI/CD Pipeline

## Pipeline Stages

1. **Install dependencies** for backend and frontend.
2. **Lint + test** to enforce quality gates.
3. **Build Docker images** for release consistency.
4. **Push image to ECR** for immutable deployment artifact.
5. **Deploy with Terraform** for repeatable infrastructure changes.
6. **Invalidate CloudFront** so users receive latest frontend build.

## Secrets

Configured through GitHub encrypted secrets:

- `AWS_ROLE_ARN`
- `ECR_BACKEND_REPO`
- `DB_PASSWORD`
- `JWT_SECRET`
- `ACM_CERT_ARN`
- `ACCOUNT_SUFFIX`
- `BACKEND_ECR_IMAGE`
- `DATABASE_URL`
- `FRONTEND_S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`

## Release Governance

- Pull request required before `main` merge.
- Pipeline status is mandatory branch protection check.
- Production deploy restricted to protected environment with reviewer approval.