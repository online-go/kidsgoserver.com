NODE_PATH:=node_modules:$(NODE_PATH)
PATH:=node_modules/.bin/:$(PATH)

dev: node_modules
	# if online-go.com/node_modules exists is really messes things up, so make sure it doesn't
	rm -Rf online-go.com/node_modules
	npm run dev

node_modules: package.json
	npm ls yarn || npm install yarn
	npm run yarn install

pretty prettier:
	npm run prettytsx
	npm run prettyts

lint tslint:
	npm run tslint -- --project tsconfig.json

min: minjs mincss

mincss:
	npm run gulp min_styl
	@echo 'gzipped kidsgo.min.css: ' `gzip -9 dist/kidsgo.min.css -c | wc -c`

minjs:
	npm run webpack -- --mode production --optimization-minimize --devtool=source-map
	@echo 'gzipped kidsgo.min.js: ' `gzip -9 dist/kidsgo.min.js -c | wc -c`
	@echo 'gzipped kidsgo-vendor.min.js: ' `gzip -9 dist/kidsgo-vendor.min.js -c | wc -c`

analyze:
	ANALYZE=true npm run analyze

#NODE_PATH=$(NODE_PATH) PATH=$(PATH) PRODUCTION=true webpack --optimization-minimize --devtool=source-map --profile --json > analyze.json
#npm run webpack-bundle-analyzer dist/ analyze.json

.PHONY: dev lint tslint min minjs mincss

-include Makefile.production
