# Board Games Infrastructure - Terraform

This directory contains Terraform configuration for AWS infrastructure that powers the Board Games application.

## Infrastructure Components

- **API Gateway WebSocket API** - Real-time WebSocket endpoint for game communication
- **Lambda Function** - Node.js handler for processing WebSocket events ($connect, $disconnect, $default)
- **CloudWatch Log Groups** - Logging for API Gateway and Lambda function
- **IAM Roles and Policies** - Proper permissions for Lambda to invoke and log

## Directory Structure

```
.
├── provider.tf         # AWS & Terraform provider configuration
├── variables.tf        # Input variables (region, project, environment)
├── locals.tf           # Local values (env, name_prefix)
├── main.tf             # (commented out - locals moved to locals.tf)
├── lambda.tf           # Lambda function, IAM role, and CloudWatch logs
├── api-gateway.tf      # API Gateway WebSocket, routes, integration
├── outputs.tf          # Output values (endpoint, function name)
├── backend.tf          # Terraform backend configuration
├── backend.tfvars      # Backend state bucket credentials
├── params.tfvars       # Terraform variable overrides
├── lambda-handler.js   # Lambda handler source code
├── package.json        # NPM scripts for Terraform commands
└── README.md           # This file
```

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) >= 1.0
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials

## Setup Instructions

### 1. Configure AWS Credentials

Ensure AWS CLI is configured with appropriate credentials:
```bash
aws configure
# or set environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
```

### 2. Configure Deployment Parameters

Edit `params.tfvars` to customize your deployment:
```hcl
aws_region = "us-east-1"
project    = "boardgames"
environment = "dev"
```

### 3. Initialize Terraform

```bash
pnpm run init
# or manually: terraform init -backend-config=backend.tfvars -reconfigure -upgrade
```

### 4. Plan Deployment

```bash
pnpm run plan
```

Review the planned changes.

### 5. Apply Configuration

```bash
pnpm run apply
```

Terraform will automatically:
- Archive `lambda-handler.js` into `game_handler.zip`
- Create all AWS resources
- Output the WebSocket endpoint

### 6. Retrieve Outputs

After successful deployment:
```bash
terraform output api_gateway_endpoint
terraform output lambda_function_name
```

## Configuration Variables

Customize deployment via `params.tfvars` or command-line variables:

```bash
pnpm run plan -- -var="aws_region=us-west-2" -var="project=mygame" -var="environment=prod"
```

Or create a `terraform.tfvars` file:

```hcl
aws_region = "us-west-2"
project    = "mygame"
environment = "prod"
```

### Available Variables

- `aws_region` - AWS region for deployment (default: `us-east-1`)
- `project` - Project name, used in resource naming (default: `boardgames`)
- `environment` - Environment name: dev, staging, prod (default: `dev`)

### Computed Values

- `local.env` - Environment qualifier based on Terraform workspace
- `local.name_prefix` - Resource prefix: `${project}-${env}` (e.g., `boardgames-dev`)

## Testing the WebSocket API

Once deployed, test the WebSocket endpoint using [wscat](https://github.com/TooTallNate/ws#cli):

```bash
# Install wscat globally
npm install -g wscat

# Get the endpoint
ENDPOINT=$(terraform output -raw api_gateway_endpoint)

# Connect to WebSocket
wscat -c $ENDPOINT

# In the wscat prompt, send a message
Connected (press CTRL+C to quit)
> {"action": "sendMessage", "message": "Hello!"}
< {"message":"Message received"}
```

## Outputs

After deployment, Terraform outputs:

- `api_gateway_endpoint` - WebSocket URI including stage (e.g., `wss://xxx.execute-api.region.amazonaws.com/dev`)
- `lambda_function_name` - Lambda function name for CI/CD integration (e.g., `boardgames-dev-game-handler`)

## Managing State

The Terraform state is stored using the backend defined in `backend.tf`. By default, it's configured for S3 + DynamoDB.

### Configure Remote State

Edit `backend.tfvars` with your S3 bucket details:
```hcl
bucket         = "your-terraform-state-bucket"
key            = "boardgames/terraform.tfstate"
region         = "us-east-1"
dynamodb_table = "terraform-locks"
encrypt        = true
```

Then initialize:
```bash
pnpm run init
```

### Local State Only

To use local state (for development):
1. Comment out the `backend "s3"` block in `backend.tf`
2. Run `terraform init -migrate-state`

### State Management Best Practices

- ✅ Encrypt state files at rest
- ✅ Enable state locking with DynamoDB
- ✅ Restrict IAM access to state bucket
- ✅ Enable S3 versioning for state recovery
- ✅ Never commit `terraform.tfstate` files to Git
- ✅ Use `.gitignore` to exclude state files

## Useful Commands

```bash
# Validate Terraform code
pnpm run validate

# Format Terraform files
pnpm run fmt

# Plan changes without applying
pnpm run plan

# Apply changes
pnpm run apply

# Destroy all resources
pnpm run destroy

# Show current state
terraform show

# Refresh state from AWS
terraform refresh

# Workspace management
terraform workspace new <env>      # Create new workspace
terraform workspace select <env>   # Switch workspace
terraform workspace list           # List workspaces
```

## Infrastructure Overview

### API Gateway WebSocket API

- **Protocol**: WebSocket (wss://)
- **Route Selection**: Based on `$request.body.action`
- **Routes Supported**:
  - `$connect` - New client connects
  - `$disconnect` - Client disconnects
  - `$default` - Any message not matching above
- **Stage**: Auto-deploy enabled with throttling (2000 req/s, 5000 burst)
- **Logging**: CloudWatch Logs with 7-day retention

### Lambda Function

- **Runtime**: Node.js 24.x
- **Memory**: 256 MB (hardcoded)
- **Timeout**: 30 seconds (hardcoded)
- **Handler**: `handler.handler` (from `lambda-handler.js`)
- **Logging**: CloudWatch Logs with 14-day retention
- **Permissions**: CloudWatch Logs only (least privilege)

### IAM Security

- Lambda role has **no API Gateway permissions** (invoked via resource-based policy)
- API Gateway has explicit Lambda invoke permission
- Lambda logs via CloudWatch with minimal required permissions
- No database or external service access

## Cost Optimization

- Lambda is configured with 256 MB memory and 30s timeout (hardcoded for consistency)
- CloudWatch Log Groups have 7-day (API Gateway) and 14-day (Lambda) retention—adjust as needed
- API Gateway throttling prevents runaway costs (2000 req/s default)
- Monitor actual usage in CloudWatch Metrics and AWS Cost Explorer

## Troubleshooting

### Lambda not being invoked

- Check Lambda permission: `aws lambda get-policy --function-name boardgames-dev-game-handler`
- Verify API Gateway integration references correct Lambda ARN
- Check CloudWatch logs: `/aws/apigateway/boardgames-dev-game-api`

### WebSocket connection fails

- Verify stage is deployed: `aws apigatewayv2 get-stage --api-id <API_ID> --stage-name dev`
- Check browser console for WebSocket errors
- Verify endpoint includes stage: `wss://xxx.execute-api.region.amazonaws.com/dev` (not just `.../`)

### Terraform state issues

```bash
# Release a stuck state lock
terraform force-unlock <LOCK_ID>

# View current state
terraform state show

# Refresh state from AWS
terraform refresh
```

### Lambda handler not found

- Verify `lambda-handler.js` exists in the infra directory
- Check that `exports.handler` is defined in the file
- Terraform will auto-zip on next `terraform plan/apply`

### Permission denied errors

- Ensure AWS credentials have IAM permissions to create:
  - API Gateway resources
  - Lambda functions
  - IAM roles and policies
  - CloudWatch Log Groups

## Additional Resources

- [AWS API Gateway WebSocket Documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api.html)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
