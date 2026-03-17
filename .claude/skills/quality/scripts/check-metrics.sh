#!/usr/bin/env bash
# Parses qlty metrics output and reports only functions exceeding complexity thresholds.
# Usage: check-metrics.sh <path> <max_cyclo> <max_cognitive>
# Example: check-metrics.sh app/ 10 15

set -euo pipefail

PATH_ARG="${1:?Usage: check-metrics.sh <path> <max_cyclo> <max_cognitive>}"
MAX_CYCLO="${2:?Missing max cyclomatic complexity}"
MAX_COGNITIVE="${3:?Missing max cognitive complexity}"

# Run qlty metrics, strip ANSI codes, and filter violations
qlty metrics --functions --sort complexity --quiet "$PATH_ARG" 2>&1 \
  | sed 's/\x1b\[[0-9;]*m//g' \
  | awk -v max_cyclo="$MAX_CYCLO" -v max_cognitive="$MAX_COGNITIVE" '
    # Track current file
    /^[a-zA-Z]/ && !/function/ && !/^-/ {
        current_file = $0
        next
    }
    # Skip header and separator lines
    /function/ && /fields/ { next }
    /^-/ { next }
    # Skip empty lines
    /^[[:space:]]*$/ { next }
    # Parse data rows: function | fields | cyclo | cognitive | lines | loc
    /\|/ {
        split($0, cols, "|")
        # Trim whitespace
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", cols[1])  # function
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", cols[3])  # cyclo
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", cols[4])  # cognitive

        func_name = cols[1]
        cyclo = cols[3] + 0
        cognitive = cols[4] + 0

        if (cyclo > max_cyclo || cognitive > max_cognitive) {
            if (!printed_header) {
                printf "%-60s %-25s %8s %10s\n", "FILE", "FUNCTION", "CYCLO", "COGNITIVE"
                printf "%-60s %-25s %8s %10s\n", "----", "--------", "-----", "---------"
                printed_header = 1
            }
            violation = ""
            if (cyclo > max_cyclo) violation = "cyclo>" max_cyclo
            if (cognitive > max_cognitive) {
                if (violation != "") violation = violation ", "
                violation = violation "cognitive>" max_cognitive
            }
            printf "%-60s %-25s %8d %10d   (%s)\n", current_file, func_name, cyclo, cognitive, violation
            found++
        }
    }
    END {
        if (found > 0) {
            printf "\n%d function(s) exceed complexity thresholds.\n", found
            exit 1
        } else {
            print "All functions within acceptable complexity limits."
            exit 0
        }
    }
'