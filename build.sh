in/bash
set -e

echo 'Ensuring dist directory exists'
mkdir -p dist

echo 'Copying all files in src to dist' 
cp src/** dist

echo 'Ensuring presentations directory exists'
mkdir -p dist/presentations

echo 'Copying fonts'
cp -r presentations/fonts dist/presentations/

echo 'Copying common presentation files'
# TODO: move boiler plate so we can just copy any html files
cp presentations/index.html dist/presentations/index.html
cp presentations/*.css dist/presentations/
cp presentations/*.js dist/presentations/

echo 'Copying LeanEstimates files'
cp -r presentations/LeanEstimates dist/presentations/

echo 'Build Success!'
