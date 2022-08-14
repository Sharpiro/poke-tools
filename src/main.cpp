#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <unistd.h>
#include "types.h"
#include "constants.h"
// #include "save_analysis/save.h"
#include "rom_analysis/rom.h"

extern "C" struct SaveData *load_save(const char *filename);
extern "C" void analyze_save(struct SaveData *save_data);

struct TestStruct
{
  int x = 32;
};

int main()
{
  struct SaveData *save_data = load_save("pokefirered.sav");
  analyze_save(save_data);
  free(save_data);
  TestStruct temp_struct = {};

  struct RomData *rom_data = load_rom("pokefirered.gba");
  analyze_rom(rom_data);
  free(rom_data);

  puts("done");
}
