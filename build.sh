set -e

# gcc \
#   -std=c2x \
#   -Wstrict-prototypes \
#   -Wall -Wwrite-strings \
#   -Wno-unused-variable -Wno-unused-but-set-variable \
#   -g -o poke-tools \
#   src/main.c src/save_analysis/save.c src/rom_analysis/rom.cpp

gcc \
  -std=c2x \
  -Wstrict-prototypes \
  -Wall -Wwrite-strings \
  -Wno-unused-variable -Wno-unused-but-set-variable \
  -g -c -o build/save.o \
  src/save_analysis/save.c

g++ \
  -Wall \
  -Wno-unused-variable -Wno-unused-but-set-variable \
  -g -c -o build/rom.o \
  src/rom_analysis/rom.cpp

g++ \
  -Wall \
  -Wno-unused-variable -Wno-unused-but-set-variable \
  -g -c -o build/main.o \
  src/main.cpp

# -x language
# -x c \
# -std=c++0x \
g++ -o poke-tools  build/save.o build/rom.o build/main.o
