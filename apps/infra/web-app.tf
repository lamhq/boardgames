locals {
  web_origin_id = "webOrigin"
}

resource "aws_cloudfront_distribution" "web_distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_200"

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  # S3 origin (web)
  origin {
    origin_id                = local.web_origin_id
    origin_path              = "/build"
    domain_name              = aws_s3_bucket.app_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.web_origin_id
    compress               = true
    viewer_protocol_policy = "allow-all"
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
    # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-caching-optimized

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.spa_route_rewrite.arn
    }
  }
}

resource "aws_cloudfront_origin_access_control" "s3_oac" {
  name                              = "access-web-bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_function" "spa_route_rewrite" {
  name    = "spa-uri-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrite any requests that do not include a file extension to `/index.html`"
  publish = true
  code    = <<EOF
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (!uri.includes('.')) {
    request.uri = '/index.html';
  }

  return request;
}
EOF
}

resource "aws_cloudfront_function" "remove_api_prefix" {
  name    = "remove-api-prefix"
  runtime = "cloudfront-js-2.0"
  comment = "Remove `/api` prefix from request uri"
  publish = true
  code    = <<EOF
function handler(event) {
  var request = event.request;
  var uri = request.uri;
 
  // Check if the URI starts with '/api'
  if (uri.startsWith('/api')) {
    // Remove /api
    request.uri = uri.replace(/^\/api/, '');
  }
 
  return request;
}
EOF
}

# Upload index.html file to S3 at build/index.html
resource "aws_s3_object" "index_html_file" {
  bucket       = aws_s3_bucket.app_bucket.id
  key          = "build/index.html"
  source       = "${path.module}/index.html"
  content_type = "text/html"
  etag         = filemd5("${path.module}/index.html")

  lifecycle {
    ignore_changes = [etag, source]
  }
}
