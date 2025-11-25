#!/bin/bash
# wait-for-it.sh

set -e

cmd="$@"
host="${1%:*}"
port="${1##*:}"
shift

until nc -z "$host" "$port"; do
  >&2 echo "$host:$port is unavailable - sleeping"
  sleep 1
done

>&2 echo "$host:$port is up - executing command"
exec $cmd
