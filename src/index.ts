import {Worker} from 'node:worker_threads';
import {availableParallelism} from 'node:os';
import {
	isBigInt64Array, isBigUint64Array, isFloat32Array, isFloat64Array, isInt16Array, isInt32Array, isInt8Array, isUint16Array, isUint32Array, isUint8Array, isUint8ClampedArray,
} from 'node:util/types';

const THREADS = availableParallelism();

type SortableArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array
	| number[];

const isSortableArray = (arr: unknown): arr is SortableArray => {
	return isInt8Array(arr)
		|| isUint8Array(arr)
		|| isUint8ClampedArray(arr)
		|| isInt16Array(arr)
		|| isUint16Array(arr)
		|| isInt32Array(arr)
		|| isUint32Array(arr)
		|| isFloat32Array(arr)
		|| isFloat64Array(arr)
		|| isBigInt64Array(arr)
		|| isBigUint64Array(arr)
		|| (Array.isArray(arr) && arr.every((value) => typeof value === 'number'));
};

const parallelSort = async (array: SortableArray) => {
	if (!isSortableArray(array)) {
		throw new Error('Invalid input: expected a typed array or array of numbers');
	}

	const chunkLength = Math.ceil(array.length / THREADS);
	const chunks = Array.from({length: THREADS}, (_, i) => array.slice(i * chunkLength, (i + 1) * chunkLength));

	const workerPath = process.env.IN_PARALLEL_SORT_TESTS === 'true' ? `${__dirname}/../dist/worker.js` : `${__dirname}/worker.js`;
	await Promise.all(chunks.map(async (chunk, index) => {
		const worker = new Worker(workerPath, {workerData: chunk});
		worker.on('message', (sortedChunk: SortableArray) => {
			chunks[index] = sortedChunk;
		});
		return new Promise<void>((resolve, reject) => {
			worker.on('error', (error) => {
				reject(error);
			});
			worker.on('exit', () => {
				resolve();
			});
		});
	}));

	const chunkPointers = Array.from({length: THREADS}, () => 0);
	for (let i = 0; i < array.length; i++) {
		let min = Infinity;
		let minChunkIndex = -1;
		for (let j = 0; j < THREADS; j++) {
			const chunk = chunks[j]!;
			const chunkIndex = chunkPointers[j]!;
			const value = chunk[chunkIndex];
			if (value !== undefined && value < min) {
				min = value as number;
				minChunkIndex = j;
			}
		}

		array[i] = min;
		chunkPointers[minChunkIndex]! += 1;
	}

	return array;
};

export default parallelSort;
