import {test, expect} from 'vitest';
import parallelSort from './index.js';

test('sorts numbers correctly, quicker than native single-threaded .sort()', {timeout: 60_000}, async () => {
	const rand1 = makeRandomArray();
	const rand2 = makeRandomArray();

	const parallelSortStartTime = process.hrtime.bigint();
	const sortedArray = await parallelSort(rand1);
	const parallelSortEndTime = process.hrtime.bigint();
	const parallelSortDuration = parallelSortEndTime - parallelSortStartTime;

	const nativeSortStartTime = process.hrtime.bigint();
	rand2.sort((a, b) => a - b);
	const nativeSortEndTime = process.hrtime.bigint();
	const nativeSortDuration = nativeSortEndTime - nativeSortStartTime;

	const isSorted = sortedArray.every((value, index) => index === 0 || value >= sortedArray[index - 1]!);
	expect(isSorted).toBe(true);

	expect(parallelSortDuration).toBeLessThan(nativeSortDuration);
});

const makeRandomArray = () => {
	return Float64Array.from({length: 10_000_000}, () => Math.random());
};
