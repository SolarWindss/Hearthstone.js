help:
    @echo "Usage: make COMMAND"
    @echo ""
    @echo "Commands:"
    @echo "  install: Installs npm dependencies"
    @echo "  help: Shows this help"
    @echo "  vanilla: Generates vanilla cards"
    @echo "  run: Runs the game"
    @echo "  build: Builds the game"
    @echo "  start: Builds & Runs the game"
    @echo "  watch: Watches the code and rebuilds it when changed"
    @echo "  clean: Remove all automatically generated files"
    @echo ""

install:
    @echo "Trying to install using npm..."
    @node --version > /dev/null 2>&1 || (echo "Nodejs is not installed" && exit 1)
    @npm config set engine-strict true
    @npm i > /dev/null

vanilla:
    @echo "Trying to generate vanilla cards..."
    @npm run script:vanilla:generate

run:
    @ls dist/index.js > /dev/null 2>&1 || (echo "The game hasn't been built." && exit 1)
    @echo "Running..."
    @npm start
    @echo "Running...Done"

build:
    @echo -e "Building...\c"
    @rm -rf ./dist/
    @npx tsc
    @echo -e "\r\x1b[KBuilding...Done"

start:
    @echo -e "Building...\c"
    @rm -rf ./dist/
    @npx tsc
    @echo -e "\r\x1b[KBuilding...Done"
    @npm start

watch:
    @rm -rf ./dist/
    @npx tsc -w

clean:
    @rm -rf ./dist/
    @rm -rf ./node_modules/
    @rm -rf ./vanillacards.json

