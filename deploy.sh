#!/bin/bash
set -e

APP_NAME=$(basename "${PWD}")

source "${HOME}/Websites/infrastructure/deploy/config.sh"
source "${HOME}/Websites/infrastructure/deploy/composer.sh"
source "${HOME}/Websites/infrastructure/deploy/etc.sh"
source "${HOME}/Websites/infrastructure/deploy/git.sh"
source "${HOME}/Websites/infrastructure/deploy/laravel.sh"
source "${HOME}/Websites/infrastructure/deploy/static.sh"

check_git_branch
build_static "app"
check_git_changes
set_laravel_permissions "/api"
deploy_git
deploy_composer "/api"
deploy_laravel "/api"
clear_laravel_cache "/api"
deploy_static "/app"
printf "\e[0;32mDone.\n\e[0m"
