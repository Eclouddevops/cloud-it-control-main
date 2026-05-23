# Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment Checklist

### Local Development
- [ ] Code tested locally with `bun dev`
- [ ] All tests pass with `bun test` (if applicable)
- [ ] Linting passes with `bun lint`
- [ ] TypeScript type checking passes
- [ ] Build succeeds with `bun run build`
- [ ] No console errors or warnings
- [ ] Environment variables configured in `.env`

### Code Quality
- [ ] No hardcoded credentials or secrets
- [ ] All dependencies are up to date
- [ ] Security vulnerabilities checked with `bun audit`
- [ ] Code follows project conventions
- [ ] Documentation updated
- [ ] Comments added where necessary

### Git & GitHub
- [ ] Code committed with clear messages
- [ ] Branch created for feature/fix
- [ ] Pull request created (for team review)
- [ ] All GitHub Actions checks pass
- [ ] Code review completed
- [ ] Ready to merge

## Deployment Checklist

### AWS Infrastructure Setup
- [ ] AWS account configured with AWS CLI
- [ ] Run `infrastructure/setup.sh` successfully
- [ ] S3 state bucket created
- [ ] OIDC provider configured
- [ ] Route 53 hosted zone identified
- [ ] ACM certificate created
- [ ] Terraform state backend configured

### Terraform Configuration
- [ ] Copy `terraform/terraform.tfvars.example` to `terraform.tfvars`
- [ ] Update all variables in `terraform.tfvars`:
  - [ ] `aws_region`
  - [ ] `environment` (dev/staging/prod)
  - [ ] `domain_name`
  - [ ] `certificate_domain`
  - [ ] `hosted_zone_id`
  - [ ] `supabase_project_id`
  - [ ] `supabase_url`
  - [ ] `supabase_publishable_key`
- [ ] Run `terraform validate` successfully
- [ ] Run `terraform plan` and review changes
- [ ] Approve and apply `terraform plan`
- [ ] All resources created successfully

### GitHub Configuration
- [ ] Repository secrets configured:
  - [ ] `AWS_ROLE_ARN_DEV`
  - [ ] `AWS_ROLE_ARN_STAGING`
  - [ ] `AWS_ROLE_ARN_UAT`
  - [ ] `AWS_ROLE_ARN_PRD`
  - [ ] `AWS_S3_BUCKET_DEV`
  - [ ] `AWS_S3_BUCKET_STAGING`
  - [ ] `AWS_S3_BUCKET_UAT`
  - [ ] `AWS_S3_BUCKET_PRD`
  - [ ] `AWS_CLOUDFRONT_DISTRIBUTION_DEV`
  - [ ] `AWS_CLOUDFRONT_DISTRIBUTION_STAGING`
  - [ ] `AWS_CLOUDFRONT_DISTRIBUTION_UAT`
  - [ ] `AWS_CLOUDFRONT_DISTRIBUTION_PRD`
  - [ ] `VITE_SUPABASE_PROJECT_ID`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
  - [ ] `SUPABASE_PROJECT_ID_PRD` (optional)
  - [ ] `SUPABASE_DB_PASSWORD_PRD` (optional)
- [ ] Secrets verified (no typos)
- [ ] Branch protection rules configured
- [ ] GitHub Environments created: `development`, `staging`, `uat`, `production`
- [ ] Required reviewers added to `uat` and `production` environments

### AWS Resources Verification
- [ ] S3 buckets created and configured
- [ ] CloudFront distributions created
- [ ] Route 53 DNS records created
- [ ] CloudWatch log groups created
- [ ] IAM roles and policies configured
- [ ] Secrets Manager secrets created
- [ ] WAF rules configured (production)

### Application Configuration
- [ ] Build environment variables set correctly
- [ ] Supabase keys verified
- [ ] Database migrations applied
- [ ] Application settings verified

### Pre-Deployment Testing
- [ ] Test workflow runs successfully
- [ ] Build completes without errors
- [ ] No security vulnerabilities detected
- [ ] CloudFront distribution is active
- [ ] DNS resolves correctly
- [ ] SSL/TLS certificate valid
- [ ] S3 bucket accessible via CloudFront

## Deployment

### Development Deployment
- [ ] Push to `develop` branch
- [ ] GitHub Actions workflow starts
- [ ] All stages complete successfully
- [ ] Application deployed to dev S3 bucket
- [ ] CloudFront cache invalidated
- [ ] Website accessible at dev domain
- [ ] Test functionality works

### Staging Deployment
- [ ] Push to `staging` branch
- [ ] GitHub Actions workflow starts
- [ ] All stages complete successfully
- [ ] Application deployed to staging S3 bucket
- [ ] CloudFront cache invalidated
- [ ] Website accessible at staging domain
- [ ] Full testing completed
- [ ] Performance validated

### UAT Deployment
- [ ] Push to `uat` branch (or merge from staging)
- [ ] GitHub Actions workflow starts
- [ ] Approval granted (if required reviewers configured)
- [ ] All stages complete successfully
- [ ] Application deployed to UAT S3 bucket
- [ ] CloudFront cache invalidated
- [ ] Website accessible at UAT domain
- [ ] Business stakeholder / QA sign-off obtained
- [ ] UAT acceptance criteria met

### PRD Deployment
- [ ] All UAT tests passed and sign-off received
- [ ] Final code review completed
- [ ] Backup of current production noted (S3 versioning)
- [ ] Rollback plan documented
- [ ] All team members notified
- [ ] Deployment window scheduled
- [ ] Push to `main` branch (or merge from uat)
- [ ] GitHub Actions workflow starts
- [ ] **Manual approval granted** by required reviewer
- [ ] All stages complete successfully
- [ ] Application deployed to PRD S3 bucket
- [ ] CloudFront cache invalidated
- [ ] Website accessible at production domain
- [ ] All functionality verified
- [ ] Monitor logs for errors
- [ ] User notification sent
- [ ] Document deployment details

## Post-Deployment

### Verification
- [ ] Application loads without errors
- [ ] All pages and features work correctly
- [ ] Images and assets load properly
- [ ] Forms and interactions function
- [ ] Database queries work
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Mobile responsive

### Monitoring
- [ ] CloudWatch alarms configured
- [ ] No error spikes in logs
- [ ] Performance metrics normal
- [ ] Traffic flowing as expected
- [ ] No 4xx or 5xx errors
- [ ] Cache hit ratio good

### Documentation
- [ ] Deployment documented
- [ ] Version/tag created
- [ ] Release notes published
- [ ] Known issues documented
- [ ] Changes communicated to team

## Rollback Procedure (If Needed)

- [ ] Identify issue immediately
- [ ] Stop further deployments
- [ ] Check S3 version history
- [ ] Restore previous version if needed
- [ ] Invalidate CloudFront cache
- [ ] Verify rollback successful
- [ ] Post incident report
- [ ] Root cause analysis

## Ongoing Maintenance

### Regular Tasks
- [ ] Monitor CloudWatch metrics daily
- [ ] Check error logs weekly
- [ ] Review costs weekly
- [ ] Update dependencies monthly
- [ ] Security audits quarterly
- [ ] Disaster recovery testing quarterly

### Monitoring
- [ ] CloudFront access logs
- [ ] S3 access logs
- [ ] CloudWatch metrics
- [ ] Error rates
- [ ] Latency metrics
- [ ] Cost trends

### Updates
- [ ] Dependency updates
- [ ] Security patches
- [ ] AWS resource updates
- [ ] Terraform version updates
- [ ] GitHub Actions updates

---

**Status**: Not Started ☐ | In Progress ⧗ | Complete ✓

**Deployment Date**: ________________

**Deployed By**: ________________

**Approver**: ________________

**Notes**: 

---

For detailed information, see:
- `AWS-DEPLOYMENT-GUIDE.md` - Quick start
- `CI-CD-PIPELINE.md` - Comprehensive guide
- `.github/SECRETS.md` - Secrets configuration
- `infrastructure/README.md` - Infrastructure details
