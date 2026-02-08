# IAM role for Lambda function
resource "aws_iam_role" "game_handler_role" {
  name = "${local.name_prefix}-game-handler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for CloudWatch Logs
resource "aws_iam_role_policy" "game_handler_logs_policy" {
  name = "${local.name_prefix}-game-handler-logs"
  role = aws_iam_role.game_handler_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:*:*"
      }
    ]
  })
}

# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "game_handler_log_group" {
  name              = "/aws/lambda/${local.name_prefix}-game-handler"
  retention_in_days = 14

  depends_on = [aws_iam_role_policy.game_handler_logs_policy]
}

# Archive game-handler.js for Lambda deployment
data "archive_file" "game_handler_zip" {
  type        = "zip"
  source_file = "${path.module}/game-handler.js"
  output_path = "${path.module}/game_handler.zip"
}

# Lambda function for WebSocket handler
resource "aws_lambda_function" "game_handler" {
  function_name = "${local.name_prefix}-game-handler"
  role          = aws_iam_role.game_handler_role.arn
  handler       = "game-handler.handler"
  runtime       = "nodejs24.x"
  timeout       = 30
  memory_size   = 256

  filename         = data.archive_file.game_handler_zip.output_path
  source_code_hash = data.archive_file.game_handler_zip.output_base64sha256

  environment {
    variables = {
      NODE_OPTIONS = "--enable-source-maps"
    }
  }

  depends_on = [
    aws_iam_role_policy.game_handler_logs_policy,
    aws_cloudwatch_log_group.game_handler_log_group
  ]
}
