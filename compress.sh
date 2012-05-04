#! /bin/bash

DIR=$(dirname $(readlink -f $0));
OUTPUT="vizhash.min.js";
#COMMAND="uglifyjs --unsafe --no-copyright";
COMMAND="yui-compressor";

command -v $COMMAND >/dev/null 2>&1 || { echo >&2 "Error: this script requires the command '$COMMAND' to be available"; exit 1; }

if [[ $1"x" != "x" ]]; then
    OUTPUT=$1;
fi

OUTPUT=$DIR'/'$OUTPUT;

cat /dev/null > $OUTPUT;

$COMMAND $DIR"/md5_sha1.js" >> $OUTPUT
echo '' >> $OUTPUT;
$COMMAND $DIR"/vizhash.js" >> $OUTPUT