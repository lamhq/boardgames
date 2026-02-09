output "game_api_endpoint" {
  description = "API Gateway WebSocket API endpoint for clients (web app) to connect"
  value       = "${aws_apigatewayv2_api.game_api.api_endpoint}/${local.env}"
}

output "game_handler_lambda_function" {
  description = "Lambda socket handler function name for CI server to deploy code to"
  value       = aws_lambda_function.game_handler.function_name
}

output "application_bucket_name" {
  description = "S3 bucket for CI server to deploy code to"
  value       = aws_s3_bucket.app_bucket.bucket
}

output "web_app_url" {
  description = "URL of the web application"
  value       = "https://${aws_cloudfront_distribution.web_distribution.domain_name}"
}

output "ci_role_arn" {
  description = "IAM role for CI server (GitHub Action) to assume to deploy the app"
  value       = aws_iam_role.ci_role.arn
}
