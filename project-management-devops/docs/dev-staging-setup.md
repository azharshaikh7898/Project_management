# Development and Staging Environment Setup

## Development

1. **Terraform**
   - Use `infra/environments/dev.tfvars` for dev infrastructure:
     ```sh
     cd infra/terraform
     terraform init
     terraform apply -var-file=../environments/dev.tfvars
     ```
2. **Docker Compose**
   - Start dev stack:
     ```sh
     cd docker
     docker-compose -f docker-compose.dev.yml up --build
     ```

## Staging

1. **Terraform**
   - Use `infra/environments/staging.tfvars` for staging infrastructure:
     ```sh
     cd infra/terraform
     terraform init
     terraform apply -var-file=../environments/staging.tfvars
     ```
2. **Docker Compose**
   - Start staging stack:
     ```sh
     cd docker
     docker-compose -f docker-compose.staging.yml up --build
     ```

## Notes
- Update secrets and credentials as needed.
- Ensure AWS and Docker credentials are configured for your environment.
- See `README.md` for more details.
