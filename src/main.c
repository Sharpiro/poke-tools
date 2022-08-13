#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <unistd.h>
#include "types.h"
#include "constants.h"
#include "save_analysis/save.h"
#include "rom_analysis/rom.h"

int main()
{
  struct SaveData *save_data = load_save("pokefirered.sav");
  analyze_save(save_data);
  free(save_data);

  struct RomData *rom_data = load_rom("pokefirered.gba");
  analyze_rom(rom_data);
  free(rom_data);

  puts("done");
}
