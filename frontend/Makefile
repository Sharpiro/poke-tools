src/test.mjs: src/test.c
	emcc --no-entry src/test.c -o src/test.mjs  \
	  -s ENVIRONMENT='web'  \
	  -s SINGLE_FILE=1  \
	  -s EXPORT_NAME='createModule'  \
	  -s USE_ES6_IMPORT_META=0  \
	  -s EXPORTED_FUNCTIONS='["_add"]'  \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
	  -O2
