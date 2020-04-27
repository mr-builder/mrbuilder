Provides sass loader for webpack.

### Options
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| options.sourceMaps| bool   | true         | Add source maps                  |
| modules       | bool       | false        | Add css module support           |
| test          | regex      | /*.s[ac]ss$/ | match *.sass and scss files      |
| options.includePaths| array|              | Add paths to include             |


### Notes
If modules is true sass as a CSS Module will be available via
    `.module.scss` and `.module.sass`. Also for legacy reasons  `.scssm`, `.sassm` will be turned on as well.
                                                                