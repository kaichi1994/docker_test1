起動方法
$ docker-compose build
$ docker-compose up
あとはlocalhost:3000にアクセスするだけ

PS C:\Users\ura.ALEX\source\repos\DockerTestReact> docker-compose up
Creating node ... done
Attaching to node
node     |
node     | up to date, audited 1507 packages in 11s
node     |
node     | 173 packages are looking for funding
node     |   run `npm fund` for details
node     |
node     | 11 vulnerabilities (1 moderate, 8 high, 2 critical)
node     |
node     | To address issues that do not require attention, run:
node     |   npm audit fix
node     |
node     | To address all issues (including breaking changes), run:
node     |   npm audit fix --force
node     |
node     | Run `npm audit` for details.
node     |
node     | > jira_react@0.1.0 start
node     | > react-scripts start
node     |
node     | (node:36) [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
node     | (Use `node --trace-deprecation ...` to show where the warning was created)
node     | (node:36) [DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] DeprecationWarning: 'onBeforeSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
node     | Starting the development server...
node     |
node     | Compiled successfully!
node     |
node     | You can now view jira_react in the browser.
node     |
node     |   Local:            http://localhost:3000
node     |   On Your Network:  http://172.18.0.2:3000
node     |
node     | Note that the development build is not optimized.
node     | To create a production build, use npm run build.
node     |
node     | asset static/js/bundle.js 2.98 MiB [emitted] (name: main) 1 related asset
node     | asset index.html 1.72 KiB [emitted]
node     | asset asset-manifest.json 190 bytes [emitted]
node     | cached modules 3.15 MiB [cached] 683 modules
node     | runtime modules 28.2 KiB 13 modules
node     | ./src/features/auth/Auth.tsx 5.03 KiB [built] [code generated]
node     | webpack 5.69.1 compiled successfully in 123134 ms
node     | No issues found.
Gracefully stopping... (press Ctrl+C again to force)
Killing node  ... done
ERROR: 2
