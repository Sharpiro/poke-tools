// #include <emscripten/emscripten.h>

// EMSCRIPTEN_KEEPALIVE int add(int x, int y)
// {
//   return x + y;
// }

// struct TempStruct
// {
//   char data[4];
// };

// // EMSCRIPTEN_KEEPALIVE struct TempStruct *map_struct(char *buffer)
// EMSCRIPTEN_KEEPALIVE struct TempStruct map_struct(char *buffer)
// // EMSCRIPTEN_KEEPALIVE int map_struct(char *buffer)
// {
//   // struct TempStruct *temp_struct = (struct TempStruct *)buffer;
//   struct TempStruct temp_struct = {.data = {5, 6, 7, 8}};
//   return temp_struct;
//   // return buffer[0];
// }

#include <stdbool.h>
#include <stdio.h>

typedef char u8;
typedef short u16;
typedef int u32;

struct TempStruct
{
  bool a;
  u8 b;
  u16 c;
  u32 d;
  u32 e[5];
  u8 f : 4;
  u8 g : 4;
};

int main()
{
  struct TempStruct temp = {.e = {1, 2, 3, 4, 5}};
  puts("hi");
  printf("%d", sizeof(temp.e) / sizeof(u32));
}