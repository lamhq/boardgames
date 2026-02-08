output "api_gateway_endpoint" {
  description = "API Gateway WebSocket API endpoint"
  value       = "${aws_apigatewayv2_api.game_api.api_endpoint}/${local.env}"
}

output "lambda_function_name" {
  description = "Lambda socket handler function name"
  value       = aws_lambda_function.game_handler.function_name
}
