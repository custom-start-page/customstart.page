#!/bin/bash

rm -r dist
mkdir dist

cp package-lock.json dist/
cp package.json dist/
cp server.js dist/
cp -r views dist/
cp -r server dist/
cp -r public dist/
# cp -r pages dist/
cp -r data dist/
