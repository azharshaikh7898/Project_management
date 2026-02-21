# Disaster Recovery

## Recovery Objectives

- Target **RPO**: 15 minutes (via automated backups + PITR).
- Target **RTO**: 2 hours for full regional redeploy.

## Backup Strategy

- RDS automated backups with 14-day retention.
- Manual snapshots before schema migrations.
- S3 versioning enabled for frontend and attachments buckets.

## Multi-AZ and Failover

- RDS Multi-AZ enabled for synchronous standby.
- ASG maintains minimum healthy app capacity across AZs.

## Migration Strategy

- SQL scripts versioned in `sql/`.
- Execute migrations during controlled deployment windows.
- Use backward-compatible schema changes first, then app cutover.

## Regional Disaster Plan

1. Promote standby region infrastructure with Terraform workspace.
2. Restore database from latest snapshot/PITR.
3. Redirect DNS/traffic through Route 53 failover policy.
4. Run smoke tests and communicate recovery status.