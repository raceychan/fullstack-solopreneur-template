.PHONY: api backend-api frontend-api

api: backend-api frontend-api

backend-api:
	$(MAKE) -C backend api

frontend-api:
	$(MAKE) -C frontend api