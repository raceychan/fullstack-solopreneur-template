.PHONY: dev
dev:
	uv run python -m src.main

.PHONY: api
api:
	uv run python -m scripts.sync_openapi

.PHONY: requirements
requirements:
	uv export --no-hashes --no-header --no-annotate --no-dev --format requirements.txt > requirements.txt
