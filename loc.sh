#!/bin/bash

src_loc="$(find src/**/*.ts | xargs wc -l | tail -n 1 | awk '{print $1;}')"
test_loc="$(find test/**/*.ts | xargs wc -l | tail -n 1 | awk '{print $1;}')"
test_async_loc="$(find test_async_nomock/**/*.ts | xargs wc -l | tail -n 1 | awk '{print $1;}')"
sum_loc=$(($src_loc+$test_loc+$test_async_loc))

echo "Source code: $src_loc LOC"
echo "Test code synchronous: $test_loc LOC"
echo "Test code asynchronous: $test_async_loc LOC"
echo "You wrote $sum_loc glorious lines of code...!"
