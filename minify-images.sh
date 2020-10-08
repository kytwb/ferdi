#!/usr/bin/env sh

# Note: This script is needed due to this bug: https://github.com/imagemin/imagemin/issues/348
# once the above is fixed, we should simply be able to specify the input directory where all image files are to be processed recursively
FILES=`find . -name "*.jpg" -o -name "*.jpeg" -o -name "*.bmp" -o -name "*.png" -type f | GREP_OPTIONS= egrep -v "node_modules|internal-server|recipes"`
for file in $FILES; do
  echo "Minifying file: $file"
  npx imagemin $file > $file
done
