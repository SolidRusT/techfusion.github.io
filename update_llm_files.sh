#!/bin/bash
## Install dependencies
pyenv update
pyenv install 3.12 -s
pyenv shell 3.12
pip install llm-file-combiner

npm install
npm run build

## Configure inputs and outputs
data_folder="data"

## Configure filters
ignore_mask=(
    .idea
    ansible
    data
    dist
    build
    images
    node_modules
    .gitignore
    .git
    .venv
    .vscode
    .DS_Store
    package-lock.json
    update_llm_files.sh
    .md
    .ico
    .png
    .svg
    .cursorrules
    .cursorignore
    bundle-analysis.html
    .xml
    .txt
    archive
)

extensions=(
    CNAME
    .html
    .css
    .ts
    .tsx
    .js
    .jsx
    .babelrc
    robots.txt
    sitemap.xml
    package.json
    personas.json
    manifest.json
    TODO.md
)

rm -f bundle-analysis.html

# run combiner for the root folder
echo "Combining all files in current directory"
file-combiner "." --output "${data_folder}/app_repo_summary.xml" --extensions "${extensions[@]}" --ignore "${ignore_mask[@]}"

npm run build