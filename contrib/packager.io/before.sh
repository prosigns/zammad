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

# Define default values if variables are not set
: "${APP_PKG_ITERATION:=1}"  # Set iteration to 1 if not set

# Use more detailed version information including packager.io build info.
if [ -z "${APP_PKG_VERSION}" ]
then
  echo "Error: APP_PKG_VERSION not set, aborting."
  exit 1
fi

ZAMMAD_VERSION="${APP_PKG_VERSION}-${APP_PKG_ITERATION}"
echo "Setting VERSION information to $ZAMMAD_VERSION"
echo "$ZAMMAD_VERSION" > VERSION

# cleanup
script/build/cleanup.sh
