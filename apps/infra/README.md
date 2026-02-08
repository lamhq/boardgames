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
├── main.tf              # Main Terraform configuration
├── variables.tf         # Input variables
├── outputs.tf          # Output values
├── provider.tf         # AWS provider configuration
├── iam.tf              # IAM roles and policies
├── lambda.tf           # Lambda function configuration
├── api-gateway.tf      # API Gateway WebSocket configuration
├── lambda_placeholder.zip  # Placeholder Lambda function (replace with your code)
└── README.md           # This file
```

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) >= 1.0
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials

## Setup Instructions

### 1. Create Lambda Deployment Package

Create a `lambda_placeholder.zip` file with your Lambda function code. The file should contain an `index.js` (or compiled JavaScript) with a handler function.

Example minimal handler:
```javascript
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));
  return { statusCode: 200, body: 'Success' };
};
```

Package it:
```bash
zip lambda_placeholder.zip index.js
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Plan Deployment

```bash
terraform plan
```

Review the planned changes.

### 4. Apply Configuration

```bash
terraform apply
```

### 5. Retrieve Outputs

After successful deployment, get the WebSocket API endpoint:

```bash
terraform output api_gateway_endpoint
```

## Environment Variables

Customize the deployment by setting Terraform variables:

```bash
terraform apply \
  -var="aws_region=us-west-2" \
  -var="environment=staging" \
  -var="lambda_memory_size=512"
```

Or create a `terraform.tfvars` file:

```hcl
aws_region    = "us-east-1"
environment   = "dev"
lambda_memory_size = 256
```

## Variables

- `aws_region` - AWS region (default: us-east-1)
- `environment` - Environment name (default: dev)
- `api_gateway_name` - API Gateway name (default: boardgames-websocket-api)
- `lambda_function_name` - Lambda function name (default: boardgames-websocket-handler)
- `lambda_runtime` - Lambda runtime version (default: nodejs20.x)
- `lambda_timeout` - Lambda timeout in seconds (default: 30)
- `lambda_memory_size` - Lambda memory in MB (default: 256)

## Testing the WebSocket API

Once deployed, test the WebSocket endpoint:

```bash
# Get the endpoint
ENDPOINT=$(terraform output -raw api_gateway_endpoint)

# Using wscat (install with: npm install -g wscat)
wscat -c $ENDPOINT
```

## Managing State

Terraform state is stored locally by default. For production:

1. **Configure Remote State** - Use S3 + DynamoDB for state locking
2. **Protect Sensitive Data** - Ensure state files are encrypted and access-controlled
3. **Version Control** - Store `.tf` files in Git, but NOT `terraform.tfstate`

Example remote state configuration:

```hcl
terraform {
  backend "s3" {
    bucket         = "your-terraform-state-bucket"
    key            = "boardgames/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

## Useful Commands

```bash
# Validate configuration
terraform validate

# Format code
terraform fmt -recursive

# Show current state
terraform show

# Destroy all resources
terraform destroy

# Refresh state from AWS
terraform refresh
```

## Security Considerations

- Lambda has minimal IAM permissions (only CloudWatch Logs)
- API Gateway has throttling enabled (rate limit: 2000, burst: 5000)
- CloudWatch logs have 14-day retention
- All resources use default VPC (modify if needed for private deployments)

## Cost Optimization

- Adjust `lambda_memory_size` based on actual needs
- Review CloudWatch log retention policies
- Monitor API Gateway data transfer

## Troubleshooting

### Lambda is not being invoked

- Check API Gateway stage integration target
- Verify Lambda permission with `aws lambda get-policy`
- Check CloudWatch logs: `/aws/apigateway/boardgames-websocket-api`

### WebSocket connection fails

- Verify API Gateway stage is deployed
- Check browser WebSocket client for connection errors
- Review API Gateway access logs

### Deployment fails with state lock

```bash
# Release a stuck lock
terraform force-unlock <LOCK_ID>
```

## Additional Resources

- [AWS API Gateway WebSocket Documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api.html)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
