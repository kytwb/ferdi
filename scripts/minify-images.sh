#!/usr/bin/env sh

# Note: This script is needed due to this bug: https://github.com/imagemin/imagemin/issues/348
# once the above is fixed, we should simply be able to specify the input directory where all image files are to be processed recursively
FILES=`find . -name "*.jpg" -o -name "*.jpeg" -o -name "*.bmp" -o -name "*.png" -type f | GREP_OPTIONS= egrep -v "node_modules|internal-server|recipes"`
for file in $FILES; do
  echo "Minifying file: $file"
  size_before=`/usr/bin/du $file | cut -f1`
  npx imagemin $file > $file.tmp && mv $file.tmp $file
  size_after=`/usr/bin/du $file | cut -f1`
  echo "$size_before  ->  $size_after"
done
