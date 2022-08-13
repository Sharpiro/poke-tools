#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <stdbool.h>
#include "types.h"
#include "constants.h"

struct SaveBlockTwo
{
  u8 playerName[PLAYER_NAME_LENGTH + 1];
  u8 the_rest[SECTOR_DATA_SIZE - 8];
};

// struct __attribute__((__packed__)) Sector
struct Sector
{
  u8 data[SECTOR_DATA_SIZE];
  u8 unused[SECTOR_FOOTER_SIZE - 12];
  u16 id;
  u16 checksum;
  u32 signature;
  u32 counter;
};

// struct __attribute__((__packed__)) Something
struct SaveData
{
  struct Sector sectors[SECTOR_COUNT * 2];
};

void do_something(struct SaveData *save_data)
{
  // todo: how to create var that is a pointer to array of Sector
  // GROSE
  // struct Sector *old = save_data->sectors;
  // struct Sector *old_x = &save_data->sectors[0];
  // struct Sector temp = *old;
  // struct Sector first_sectors[SAVE_SLOT_SECTOR_COUNT] = {};
  // struct Sector second_sectors[SAVE_SLOT_SECTOR_COUNT] = {};
  // int first_sector_index = 0;
  // int second_sector_index = 0;
  u32 first_sector_counter = save_data->sectors[0].counter;
  u32 second_sector_counter = save_data->sectors[SAVE_SLOT_SECTOR_COUNT].counter;
  bool pick_first_sector = first_sector_counter > second_sector_counter;
  int start_index = pick_first_sector ? 0 : SAVE_SLOT_SECTOR_COUNT;
  int end_index = pick_first_sector
                      ? SAVE_SLOT_SECTOR_COUNT
                      : SAVE_SLOT_SECTOR_COUNT * 2;
  struct SaveBlockTwo *save_block_two;
  for (int i = start_index; i < end_index; i++)
  {
    struct Sector *current_sector = &save_data->sectors[i];
    printf("i: %d, id: %d, counter:%d\n", i, current_sector->id, current_sector->counter);
    if (current_sector->id == 0)
    {
      save_block_two = (struct SaveBlockTwo *)&current_sector->data;
      int x = 2;
    }
  }
}

int main()
{
  FILE *file;
  file = fopen("pokefirered.sav", "r");
  // file = fopen("fake.sav", "r");
  // file = fopen("fake_short.sav", "r");
  fseek(file, 0, SEEK_END);
  // int temp_no = fileno(file);
  // int temp = fstat(temp_no, &file_stat);
  long file_len = ftell(file);
  fseek(file, 0, SEEK_SET);
  u8 *buffer = malloc(file_len);
  int read_result = fread(buffer, file_len, 1, file);
  if (read_result != 1)
  {
    return 1;
  }

  struct SaveData *save_data = (struct SaveData *)buffer;
  do_something(save_data);

  free(buffer);
  fclose(file);
  puts("done");
}
