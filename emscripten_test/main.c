#include <stdio.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

int c = 0;

int main(){
  puts("hello!\n");
  return 0;
}

EMSCRIPTEN_KEEPALIVE 
int add(int a){
  return a + 11;
}

EMSCRIPTEN_KEEPALIVE
int incr(){
  c++;
  return c;
}
