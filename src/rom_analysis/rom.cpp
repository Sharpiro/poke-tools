#include <stdio.h>
#include <stdlib.h>
#include "../types.h"
#include "../constants.h"
#include "rom.h"

// extern "C" struct RomData *load_rom(const char *filename)
struct RomData *load_rom(const char *filename)
{
  FILE *file;
  file = fopen(filename, "r");
  fseek(file, 0, SEEK_END);
  long file_len = ftell(file);
  fseek(file, 0, SEEK_SET);
  u8 *buffer = (u8 *)malloc(file_len);
  int read_result = fread(buffer, file_len, 1, file);
  fclose(file);
  if (read_result != 1)
  {
    exit(1);
  }

  struct RomData *save_data = (struct RomData *)buffer;
  return save_data;
}

static struct Pokemon max(struct BaseStats (*base_stats)[POKEMON_COUNT])
{
  const int length = sizeof(*base_stats) / sizeof(struct BaseStats);

  struct BaseStats *max_stats = &(*base_stats)[0];
  u16 species_id = 0;
  for (u16 i = 0; i < length; i++)
  {
    struct BaseStats *current = &(*base_stats)[i];
    if (current->baseHP > max_stats->baseHP)
    {
      max_stats = current;
      species_id = i;
    }
  }

  struct Pokemon pokemon = {.species_id = species_id, .base_stats = max_stats};
  return pokemon;
}

int test()
{
  return 1;
}

void analyze_rom(struct RomData *save_data)
{
  const int temp = sizeof(struct BaseStats);
  const int temp2 = sizeof(save_data->base_stats[0]);
  const int base_stats_arr_size = sizeof(save_data->base_stats);
  const int temp3 = sizeof(*save_data);
  const int temp4 = sizeof(struct RomData);
  struct BaseStats(*base_stats)[412] = &save_data->base_stats;
  // struct BaseStats *base_stats = save_data->base_stats;
  // max(save_data->base_stats);
  // max(&base_stats);
  // void (*fun_ptr)(int) = &fun;
  // int (*temp)(struct BaseStats) { return 1; };
  // int (*temp_func)(struct BaseStats) = &test;
  // int (*temp_func)(int) = [](int temp)
  // { return 1; };
  auto temp_func2 = [](int temp)
  {
    return 1;
  };
  // temp_func(1);
  // temp_func2(1);
  struct Pokemon max_stat = max(base_stats);
  int temp_xyz = 2;

  // int temp_inner()
  // {
  //   return 1;
  // }
}
