#!/usr/bin/env bash
set -e

CURRENT_VERSION=$(npm run version --silent)
NEW_VERSION="$CURRENT_VERSION-alpha-$(date +%Y%m%d%H%M)"

echo "Uploading npm package version $NEW_VERSION"
cp travis/.npmrc $HOME/.npmrc

npm version "$NEW_VERSION" --commit-hooks false --git-tag-version false

npm publish --tag alpha
