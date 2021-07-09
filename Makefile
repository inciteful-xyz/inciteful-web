
.PHONY: check-env

serve-site:
	cargo watch -s 'sleep 2.0 && cargo run -p web' --why -i "web/app/**"

npm-watch:
	npm run watch

npm-build-release:
	npm install
	npm run build-prod
