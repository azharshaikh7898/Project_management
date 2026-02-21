output "vpc_id" {
  value = aws_vpc.main.id
}

output "alb_dns_name" {
  value = aws_lb.app.dns_name
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.address
}

output "frontend_bucket" {
  value = aws_s3_bucket.frontend.bucket
}

output "attachments_bucket" {
  value = aws_s3_bucket.attachments.bucket
}

output "api_gateway_endpoint" {
  value = aws_apigatewayv2_stage.default.invoke_url
}