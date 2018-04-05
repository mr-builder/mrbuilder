Provides typescript


Please add a tsconfig.json to your project's root to be able to use

see

```
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": ".",
    "suppressExcessPropertyErrors": true,
    "declaration": true,
    "outDir": "@types",
    "target": "es5",
    "strictNullChecks": false,
    "sourceMap": true,
    "skipLibCheck": true,
    "jsx": "react",
    "lib": [
      "dom",
      "es2015"
    ]
  },
  "files": [
    "./src/*.tsx"
  ]
}


```
If you see
ERROR in /Users/jspears/WebstormProjects/mr-builder-repository/plugins/mrbuilder-plugin-typescript/tsconfig.json
[tsl] ERROR
      TS18003: No inputs were found in config file 'tsconfig.json'. Specified 'include' paths were '["./src/**/*"]' and 'exclude' paths were '["node_modules","**/*.spec.ts"]'.
