#define ROM_SIZE (1 << 24)

#define BASE_STATS_LOCATION 0x2549b8
#define POKEMON_COUNT 412

struct BaseStats
{
  u8 baseHP;
  u8 baseAttack;
  u8 baseDefense;
  u8 baseSpeed;
  u8 baseSpAttack;
  u8 baseSpDefense;
  u8 type1;
  u8 type2;
  u8 catchRate;
  u8 expYield;
  u16 evYield_HP : 2;
  u16 evYield_Attack : 2;
  u16 evYield_Defense : 2;
  u16 evYield_Speed : 2;
  u16 evYield_SpAttack : 2;
  u16 evYield_SpDefense : 2;
  u16 item1;
  u16 item2;
  u8 genderRatio;
  u8 eggCycles;
  u8 friendship;
  u8 growthRate;
  u8 eggGroup1;
  u8 eggGroup2;
  u8 abilities[2];
  u8 safariZoneFleeRate;
  u8 bodyColor : 7;
  u8 noFlip : 1;
  u8 filler[2];
};

struct RomData
{
  u8 pre_data[BASE_STATS_LOCATION];
  struct BaseStats base_stats[POKEMON_COUNT];
  u8 post_data[ROM_SIZE - BASE_STATS_LOCATION - POKEMON_COUNT * sizeof(struct BaseStats)];
};

struct RomData *load_rom(const char *filename);

void analyze_rom(struct RomData *save_data);