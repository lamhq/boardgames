# API Gateway WebSocket API
resource "aws_apigatewayv2_api" "game_api" {
  name                       = "${local.name_prefix}-game-api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
  description                = "WebSocket API for real-time game communication"
  ip_address_type            = "ipv4"
}

# API Gateway Stage
resource "aws_apigatewayv2_stage" "game_api_stage" {
  api_id      = aws_apigatewayv2_api.game_api.id
  name        = local.env
  auto_deploy = true

  default_route_settings {
    data_trace_enabled     = true
    logging_level          = "INFO"
    throttling_burst_limit = 5000
    throttling_rate_limit  = 2000
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.game_api_log_group.arn
    format = jsonencode({
      requestId          = "$context.requestId"
      ip                 = "$context.identity.sourceIp"
      requestTime        = "$context.requestTime"
      httpMethod         = "$context.httpMethod"
      routeKey           = "$context.routeKey"
      status             = "$context.status"
      protocol           = "$context.protocol"
      responseLength     = "$context.responseLength"
      integrationLatency = "$context.integration.latency"
    })
  }

  depends_on = [aws_cloudwatch_log_group.game_api_log_group]
}

# CloudWatch Log Group for API Gateway
resource "aws_cloudwatch_log_group" "game_api_log_group" {
  name              = "/aws/apigateway/${local.name_prefix}-game-api"
  retention_in_days = 7
}

# $connect route
resource "aws_apigatewayv2_route" "connect" {
  api_id    = aws_apigatewayv2_api.game_api.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.game_handler_integration.id}"
}

# $disconnect route
resource "aws_apigatewayv2_route" "disconnect" {
  api_id    = aws_apigatewayv2_api.game_api.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.game_handler_integration.id}"
}

# Default route for other messages
resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.game_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.game_handler_integration.id}"
}

# Lambda integration
resource "aws_apigatewayv2_integration" "game_handler_integration" {
  api_id             = aws_apigatewayv2_api.game_api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.game_handler.invoke_arn
}

# IAM policy for API Gateway to invoke Lambda
resource "aws_lambda_permission" "handler_invoke_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.game_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.game_api.execution_arn}/*/*"
}
