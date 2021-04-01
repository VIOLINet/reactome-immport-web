# immport-reactome-web documentation

## Dev Environment setup
This dev environment assumes a Mac or Linux dev environment.
Please install nvm through homebrew on a Mac, (or follow the documentation [here](https://github.com/nvm-sh/nvm#installing-and-updating))

Next, install the latest version of Node:
```
nvm install --lts
```

Finally, install Vue CLI 3
```
npm install -g @vue/cli
```
clone the project, cd into the directory, and follow the Project setup steps

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Compiles and minifies for production with extra steps
```
npm run build-deploy
```
builds project and copies to new output directory. Please adjust output 
directory if you plan to use this build process for yourself

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
