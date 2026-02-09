resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com",
  ]

  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1b511abead59c6ce207077c0ef0e0d40009d61e7"
  ]
}

resource "aws_iam_role" "ci_role" {
  name = "${local.name_prefix}-ci-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
          },
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo_id}:*"
          }
        }
      },
    ]
  })
}

resource "aws_iam_policy" "deploy_code_policy" {
  name        = "${local.name_prefix}-code-deploy-policy"
  description = "Permissions to deploy code"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # update files to s3
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject", 
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.app_bucket.arn}",
          "${aws_s3_bucket.app_bucket.arn}/*",
        ]
      },
      # create cloudfront invalidations
      {
        Effect = "Allow"
        Action = ["cloudfront:CreateInvalidation"]
        Resource = "${aws_cloudfront_distribution.web_distribution.arn}"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "code_deploy_pol_attm" {
  role       = aws_iam_role.ci_role.name
  policy_arn = aws_iam_policy.deploy_code_policy.arn
}
