#include <stdio.h>

int c = 0;

int main(){
  puts("hello!\n");
  return 0;
}

int add(int a){
  return a + 11;
}

int incr(){
  c++;
  return c;
}
