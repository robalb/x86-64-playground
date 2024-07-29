
.PHONY: dev_deploy
dev_deploy: main.wasm
	cp main.wasm ../svelte_blinkenweb/src/assets/

main.wasm: main.o
	wasm-ld-13 --no-entry --export-all -o main.wasm main.o

main.o: main.ll
	llc -march=wasm32 -filetype=obj main.ll
	

main.ll: main.c
	clang --target=wasm32 -emit-llvm -c -S main.c

