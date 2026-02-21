# DevOps Strategy

## Lifecycle Management

1. Plan and refine backlog.
2. Build with trunk-based Git workflow and pull requests.
3. Validate through CI checks (lint, test, image build).
4. Deploy via Terraform-driven release pipeline.
5. Observe using logs, metrics, and alarms.
6. Improve through post-incident reviews and sprint retrospectives.

## Deployment Patterns

### Rolling Deployment

- Default for low-risk releases.
- ASG gradually replaces instances with latest launch template/image.
- Maintains service continuity while minimizing infrastructure duplication cost.

### Blue-Green Deployment

- Used for high-risk releases.
- Create parallel ASG/target group (green), validate via smoke tests, then switch ALB listener.
- Fast rollback by returning listener to blue target group.

## Containerization Migration Path

- **Current**: Docker image running on EC2.
- **Next**: ECS (Fargate or EC2 launch type) for managed scheduling.
- **Advanced**: EKS with service mesh and GitOps for large multi-team scale.

## Tagging Strategy

Mandatory tags: `Project`, `Environment`, `Owner`, `ManagedBy`, `CostCenter`.

Benefits:

- Cost attribution and showback/chargeback
- Compliance traceability
- Automation scoping for runbooks and incident response