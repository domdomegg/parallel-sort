import {workerData, parentPort} from 'node:worker_threads';

if (!parentPort) {
	throw new Error('Missing parentPort: this must be run in a worker thread');
}

parentPort.postMessage((workerData as number[]).sort((a, b) => a - b));
