CC=emcc

a.out.js: main.c
	$(CC) main.c -o a.out.html -sMINIMAL_RUNTIME=1 -sENVIRONMENT=web

.PHONY: dev
dev: a.out.js
	python3 -m http.server

