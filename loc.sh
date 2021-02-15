#!/bin/bash

lib_loc="$(find lib -name "*.ts" | xargs wc -l | tail -n 1 | awk '{print $1;}')"
test_loc="$(find test -name "*.ts" | xargs wc -l | tail -n 1 | awk '{print $1;}')"
scripts_loc="$(find data -name "*.ts" | xargs wc -l | tail -n 1 | awk '{print $1;}')"
sum_loc=$(($lib_loc + $test_loc + $scripts_loc))

echo "--------------------------"
echo "Lib		: $lib_loc LOC"
echo "Tests		: $test_loc LOC"
echo "Scripts		: $scripts_loc LOC"
echo "--------------------------"
echo "Total		: $sum_loc LOC (Typescript)"
