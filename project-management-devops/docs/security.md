# Security Hardening

## Identity and Access

- IAM least privilege for EC2 runtime role.
- Separation of CI deploy role and runtime role.
- No long-lived AWS access keys in repository.

## Network Security

- No public EC2 instances.
- RDS in private subnets only, reachable solely from app security group.
- HTTPS-only from edge to ALB with ACM certificates.

## Application Security

- JWT validation middleware for protected endpoints.
- Password hashing with bcrypt (cost factor 12).
- Helmet headers and restricted CORS allowlist.
- API Gateway throttling for rate limiting.

## Data Protection

- Encryption at rest on RDS and S3.
- S3 public access blocked; bucket policy denies unsecured access.
- Backup retention and deletion protection on production database.

## Infrastructure Security Audit Checklist

- Validate SG rules for least exposure.
- Validate IAM policies for wildcard overreach.
- Confirm CloudTrail and Config enabled at account level.
- Run periodic Terraform compliance checks (e.g., tfsec/checkov in CI).