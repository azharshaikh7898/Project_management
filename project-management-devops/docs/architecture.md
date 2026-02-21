# Cloud Architecture

## 3-Tier Design

- **Presentation**: React SPA hosted in S3 and accelerated through CloudFront.
- **Application**: Node.js/Express API on EC2 in private subnets, scaled by Auto Scaling Group and exposed by ALB.
- **Data**: PostgreSQL on RDS (Multi-AZ) and private S3 for file attachments.

## Networking

- Single VPC with public and private subnets across two AZs.
- Public subnets host ALB and NAT gateway.
- Private app subnets host EC2 instances (no public IPs).
- Private DB subnets host RDS.

## High Availability

- Multi-AZ RDS deployment.
- ASG minimum capacity of 2 instances across AZs.
- Health checks via `/health` endpoint and ALB target health.

## Scalability

- Horizontal scaling through ASG policies based on CPU.
- CloudFront edge caching for frontend static assets.
- S3 decouples attachment storage from app nodes.

## Future Multi-Region Strategy

- Add secondary region with warm standby Terraform workspace.
- Cross-region S3 replication for critical assets.
- Aurora global database or cross-region RDS read replica as evolution path.
- Route 53 failover policy to route users to healthy region.