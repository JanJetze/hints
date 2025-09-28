# Root Makefile for project-wide commands

.PHONY: deploy-backend

deploy-backend:
	$(MAKE) -C backend build
	$(MAKE) -C backend deploy
