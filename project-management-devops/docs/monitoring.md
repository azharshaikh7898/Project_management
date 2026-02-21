# Monitoring and Observability

## Logging

- Backend emits structured JSON logs using `pino`.
- Logs include request metadata, status codes, and latency.
- Forward application logs to CloudWatch log groups.

## Metrics

- EC2 CPU utilization alarms for autoscaling actions.
- Memory alarm via CloudWatch Agent metric `mem_used_percent`.
- RDS `DatabaseConnections` alarm for pool pressure detection.

## Health Checks

- `/health` endpoint verifies API process and database reachability.
- ALB target group health check path configured to `/health`.

## Incident Response

- Alert via SNS integration (recommended extension).
- Use runbooks for DB connection spikes, CPU saturation, and instance churn.
- Maintain service-level objectives and weekly alert tuning.