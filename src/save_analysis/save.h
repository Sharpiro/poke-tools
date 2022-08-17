#pragma once

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

struct SaveData *load_save(const char *filename);

void analyze_save(struct SaveData *save_data);