#!/bin/bash

src_loc="$(find src -name "*.ts" | xargs wc -l | tail -n 1 | awk '{print $1;}')"
test_loc="$(find test -name "*.ts" | xargs wc -l | tail -n 1 | awk '{print $1;}')"
test_async_loc="$(find test_async -name "*.ts" | xargs wc -l | tail -n 1 | awk '{print $1;}')"
test_perf_loc="$(find test_performance -name "*.js" | xargs wc -l | tail -n 1 | awk '{print $1;}')"
sum_loc=$(($src_loc+$test_loc+$test_async_loc+$test_perf_loc))

echo "Source code: $src_loc LOC"
echo "Test code synchronous: $test_loc LOC"
echo "Test async nomock: $test_async_loc"
echo "Test performance: $test_perf_loc"
echo "You wrote $sum_loc glorious lines of code...!"
