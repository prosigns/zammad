#!/bin/bash
#
# packager.io before script
#

set -euxo pipefail  # set the script to exit upon failure, undefined variables will cause script to exit

# print environment
uname -a
ruby -v
env
cat Gemfile.lock

echo "Setting VERSION information to 2.0.1"
echo "$ZAMMAD_VERSION" > VERSION

# cleanup
script/build/cleanup.sh
