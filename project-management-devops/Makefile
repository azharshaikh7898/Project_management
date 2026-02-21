.PHONY: bootstrap up down lint test tf-init tf-plan tf-apply

bootstrap:
	cd backend && npm install
	cd frontend && npm install

up:
	cd docker && docker compose up --build -d

down:
	cd docker && docker compose down -v

lint:
	cd backend && npm run lint
	cd frontend && npm run lint

test:
	cd backend && npm run test
	cd frontend && npm run test

tf-init:
	cd infra/terraform && terraform init

tf-plan:
	cd infra/terraform && terraform plan -var-file=../environments/prod.tfvars

tf-apply:
	cd infra/terraform && terraform apply -var-file=../environments/prod.tfvars