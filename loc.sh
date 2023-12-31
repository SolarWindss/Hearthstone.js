#!/bin/bash
# Finds how many lines of code is in the program.
function exclude {
    grep -v -e 'package-lock.json' -e 'LICENSE' -e '.github/*' -e 'tsconfig.json' -e 'cards/Examples/DIY/*';
}

function count {
    xargs -d '\n' wc -l | grep 'total' | grep --color=never -o '[0-9]*'
}

# Currently ~19.9k
echo "With Cards:"
git ls-files | exclude | count

# Currently ~14.8k
echo -e "\nWithout Cards:"
git ls-files | exclude | grep -v 'cards/*' | count
