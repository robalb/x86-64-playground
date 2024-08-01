CC=emcc

.PHONY: dev
dev: a.out.js
	python3 -m http.server

a.out.js: main.c
	$(CC) main.c -o a.out.html -sMINIMAL_RUNTIME=1 -sENVIRONMENT=web
