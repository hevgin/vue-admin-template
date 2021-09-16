## Build Setup


```bash
# clone the project
git clone https://github.com/PanJiaChen/vue-admin-template.git

# enter the project directory
cd vue-admin-template

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```
## husky && lint-staged && validate-commit-msg

```bash
# init husky
npx husky-init

# package.json
"lint-staged": {
  "src/**/*.{js,vue,jsx,ts,tsx}": "eslint"
},
"config": {
  "validate-commit-msg": {
    "types": ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
    "warnOnFail": false,
    "maxSubjectLength": 100,
    "subjectPattern": ".+",
    "subjectPatternErrorMsg": "请输入message信息!",
    "helpMessage": "Commit message 格式错误， http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html"
  }
},

# .husky/pre-commmit
npx lint-staged

# .husky/commit-msg
npx validate-commit-msg
```
