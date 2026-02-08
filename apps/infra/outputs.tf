output "game_api_endpoint" {
  description = "API Gateway WebSocket API endpoint"
  value       = "${aws_apigatewayv2_api.game_api.api_endpoint}/${local.env}"
}

output "game_handler_lambda_function" {
  description = "Lambda socket handler function name"
  value       = aws_lambda_function.game_handler.function_name
}

output "application_bucket_name" {
  description = "The S3 bucket for storing files of the application"
  value       = aws_s3_bucket.app_bucket.bucket
}

output "web_app_domain" {
  value       = aws_cloudfront_distribution.web_distribution.domain_name
  description = "The domain name of the CloudFront distribution"
}
