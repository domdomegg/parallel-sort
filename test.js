// eslint-disable-next-line no-undef
const parallelSort = require('./dist/index.js').default;

const main = async () => {
	const rand1 = Float64Array.from({length: 10_000_000}, () => Math.random());
	const rand2 = Float64Array.from({length: 10_000_000}, () => Math.random());

	console.time('parallelSort time');
	await parallelSort(rand1);
	console.timeEnd('parallelSort time');

	console.time('nativeSort time');
	rand2.sort((a, b) => a - b);
	console.timeEnd('nativeSort time');
};

main();
