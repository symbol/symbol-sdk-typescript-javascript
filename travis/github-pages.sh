#!/usr/bin/env bash
set -e

PUBLICATION_BRANCH=gh-pages
# Checkout the branch
REPO_PATH=$PWD
CURRENT_VERSION=$(npm run version --silent)
rm -rf $HOME/publish
cd $HOME
git clone --branch=$PUBLICATION_BRANCH    https://${GITHUB_TOKEN}@github.com/$TRAVIS_REPO_SLUG publish 2>&1 > /dev/null
cd publish
# Update pages

cp -r $REPO_PATH/ts-docs/. ./
# Commit and push latest version
git add .
git config user.name  "Travis"
git config user.email "travis@travis-ci.org"
git commit -m "Uploading $CURRENT_VERSION docs."
git push -fq origin $PUBLICATION_BRANCH 2>&1 > /dev/null
cd $REPO_PATH
