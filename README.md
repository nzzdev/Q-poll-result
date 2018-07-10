# Q Poll Result

**Maintainer**: [manuelroth](https://github.com/manuelroth)

Q Poll Result is one tool of the Q toolbox to render poll results.
Test it in the demo: https://editor.q.tools

## Examples

The tool is designed specifically for poll results in Switzerland which are done prior to votings on intiatives and referendums. Hence, we have two pre-defined scales:

* Three answer scale

![Poll result with three answer scale](./readme-images/three-answer-poll.png)

* Five answer scale

![Poll result with five answer scale](./readme-images/five-answer-poll.png)

The scales can also be mixed together:
![Poll result with mixed answer scales](./readme-images/mixed-scale-poll.png)


## Installation

```bash
$ npm install
$ npm run build
```

## Development

Install the [Q cli](https://github.com/nzzdev/Q-cli) and start the Q dev server:

```
$ Q server
```

Run the Q tool:
```
$ node index.js
```

## Implementation details
The tool structure follows the general structure of each Q tool. Further information can be found in [Q server documentation - Developing tools](https://nzzdev.github.io/Q-server/developing-tools.html).

## License
Copyright (c) 2018 Neue Zürcher Zeitung. All rights reserved.

This software is published under the MIT license.
