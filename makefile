.PHONY: api backend-api frontend-api run backend frontend

api: backend-api frontend-api

backend-api:
	$(MAKE) -C backend api

frontend-api:
	$(MAKE) -C frontend api

backend:
	$(MAKE) -C backend dev

frontend:
	$(MAKE) -C frontend dev
