.PHONY: api backend-api frontend-api run backend-run frontend-run

api: backend-api frontend-api

backend-api:
	$(MAKE) -C backend api

frontend-api:
	$(MAKE) -C frontend api

run: backend-run frontend-runt

backend-run:
	$(MAKE) -C backend run

frontend-run:
	$(MAKE) -C frontend run
