npm-watch:
	npm run watch

npm-build-release:
	npm install
	npm run build-prod

firebase-start:
	firebase emulators:start --export-on-exit=./firebase-backup --import=./firebase-backup