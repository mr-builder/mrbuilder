#!/usr/bin/env bash


readme(){
  NAME=$1
  cat <<EOF
${NAME}
===
This plugin is designed to be used with (mrbuilder)[https://github.com/jspears/mrbuilder].

## Installation
EOF


cat <<"EOF"
```sh
EOF

cat << EOF
  $ yarn add "${NAME}" -D
EOF

cat <<"EOF"
```
EOF



cat <<"EOF"
## Configuration
In package.json
```json
EOF

cat <<EOF
{
 "name":"your_component"
 ...
 "mrbuilder":{
    "plugins":[
      "${NAME}"
    ]

 }
}
EOF

cat <<"EOF"
```
EOF

}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    readme "$@"
fi
