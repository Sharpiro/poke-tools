#include <stdio.h>
#include <stdlib.h>
#include "../types.h"
#include "../constants.h"
#include "rom.h"

struct RomData *load_rom(const char *filename)
{
  FILE *file;
  file = fopen(filename, "r");
  fseek(file, 0, SEEK_END);
  long file_len = ftell(file);
  fseek(file, 0, SEEK_SET);
  u8 *buffer = malloc(file_len);
  int read_result = fread(buffer, file_len, 1, file);
  fclose(file);
  if (read_result != 1)
  {
    exit(1);
  }

  struct RomData *save_data = (struct RomData *)buffer;
  return save_data;
}

// static void *max(struct BaseStats (*base_stats)[412])
static void *max(struct BaseStats base_stats[412])
// static void *max(struct BaseStats *base_stats)
{
  const int base_stats_arr_size = sizeof(*base_stats);
  struct BaseStats *temp = &base_stats[411];
  int temp_xyz = 2;
  // struct BaseStats *temp = base_stats[900];
  //
}

void analyze_rom(struct RomData *save_data)
{
  const int temp = sizeof(struct BaseStats);
  const int temp2 = sizeof(save_data->base_stats[0]);
  const int base_stats_arr_size = sizeof(save_data->base_stats);
  const int temp3 = sizeof(*save_data);
  const int temp4 = sizeof(struct RomData);
  // struct BaseStats(*base_stats)[412] = &save_data->base_stats;
  struct BaseStats *base_stats = save_data->base_stats;
  int temp_xyz = 2;
  // max(&save_data->base_stats);
  max(base_stats);
}
