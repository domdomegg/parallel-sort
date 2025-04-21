# parallel-sort

Node.js library for multi-threaded sorting of large number arrays.

Most useful when doing frequent sorts of arrays larger than 10 million elements.

_NB: This library only works in Node.js, and not in the browser, as it depends on the [Node.js worker threads API](https://nodejs.org/api/worker_threads.html)._

## Usage

Install with `npm install parallel-sort`. Then use it in your project:

```ts
import parallelSort from 'parallel-sort';

const myBigArrayThatNeedsSorting = Float64Array.from({length: 10_000_000}, () => Math.random());
const mySortedArray = await parallelSort(myBigArrayThatNeedsSorting);
```

## Contributing

Pull requests are welcomed on GitHub! To get started:

1. Install Git and Node.js
2. Clone the repository
3. Install dependencies with `npm install`
4. Run `npm run test` to run tests
5. Build with `npm run build`

## Releases

Versions follow the [semantic versioning spec](https://semver.org/).

To release:

1. Use `npm version <major | minor | patch>` to bump the version
2. Run `git push --follow-tags` to push with tags
3. Wait for GitHub Actions to publish to the NPM registry.
