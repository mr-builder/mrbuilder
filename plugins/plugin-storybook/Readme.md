Provides [Storybook](https://storybook.js.org) support for mrbuilder.


## Options
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| addons        | string[]   | [ "@storybook/addon-knobs/register", "@storybook/addon-options/register"]           |an array of plugins  |
| parameters    | {}         | {"goFullScreen":false,"showLeftPanel":true,"showDownPanel":true,"showSearchBox":false,"downPanelInRight":true,"sortStoriesByKind":true,"hierarchySeparator":null,"sidebarAnimations":true,"selectedAddonPanel":null}| paramters to set
| outputDir     | string     | storybook-static | Output directory |
| staticDir     | string     |                  | Directory of static files to load |
| sourceDir     | string     | src  | Directory to look for stories |
| test          | Regex      | /.stories.js$/   | pattern to look for stories |
| themePkg      | string     | @storybook/theming | package to look for theme |
| theme         | string     | light  | path to theme from themePkg object |
| port          | number     |    | random    |
| host          | string     |    | Host to bind to   |
| sslCa         | string     |    | SSL CA     |
| sslCert       | string     |    | SSL Cert   |
| sslKey        | string     |    | SSL Key  |
| dll           |    |    |    |
| ci            |    |    |    |
| smokeTest     |    |    |    |
| quiet         |    |    |    ||
| host          |    |    |    |
| ignorePreview |    |    |    |
| docs          |    |    |    |
| frameworkPresets |    |    |    |
| previewUrl    |    |    |    |
