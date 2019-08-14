import {BinaryHeap, BinaryHeapMode as Mode} from "../../src/datastructs/BinaryHeap";


describe('BinaryHeap Performance tests - ', () => {
	let binHeap: BinaryHeap;

	it('tests MIN heap on a slightly larger example and floats', () => {
		let evalPriority = (obj: any) => {
			if (typeof obj !== 'number' && typeof obj !== 'string') {
				return NaN;
			}
			return typeof obj === 'number' ? obj : parseFloat(obj);
		};
		binHeap = new BinaryHeap(Mode.MIN, evalPriority);

		for (let i = 0; i < 5000; i++) {
			binHeap.insert((Math.random() * 1000 - 500));
		}

		let binArray = binHeap.getArray(),
			ith = 0,
			left_child_idx = 0,
			right_child_idx = 0;
		for (let i = 0; i < binArray.length; i++) {
			ith = binArray[i];
			left_child_idx = (i + 1) * 2 - 1;
			right_child_idx = (i + 1) * 2;
			if (left_child_idx < binArray.length) {
				expect(ith).toBeLessThanOrEqual(binArray[left_child_idx]);
			}
			if (right_child_idx < binArray.length) {
				expect(ith).toBeLessThanOrEqual(binArray[right_child_idx]);
			}
		}

		let last = Number.NEGATIVE_INFINITY,
			current,
			heap_size = binHeap.size();
		for (let i = 0; i < 5000; i++) {
			current = binHeap.pop();
			if (typeof current !== 'undefined') {
				expect(current).toBeGreaterThanOrEqual(last);
				expect(binHeap.size()).toEqual(heap_size - 1);
				last = current;
				--heap_size;
			}
		}

	});


	it('tests MAX heap on a slightly larger example', () => {
		binHeap = new BinaryHeap(Mode.MAX);
		for (let i = 0; i < 5000; i++) {
			binHeap.insert((Math.random() * 1000 - 500) | 0);
		}

		let binArray = binHeap.getArray(),
			ith = 0,
			left_child_idx = 0,
			right_child_idx = 0;
		for (let i = 0; i < binArray.length; i++) {
			ith = binArray[i];
			left_child_idx = (i + 1) * 2 - 1;
			right_child_idx = (i + 1) * 2;
			if (left_child_idx < binArray.length) {
				expect(ith).toBeGreaterThanOrEqual(binArray[left_child_idx]);
			}
			if (right_child_idx < binArray.length) {
				expect(ith).toBeGreaterThanOrEqual(binArray[right_child_idx]);
			}
		}

		let last = Number.POSITIVE_INFINITY,
			current,
			heap_size = binHeap.size();
		for (let i = 0; i < 5000; i++) {
			if (typeof current !== 'undefined') {
				current = binHeap.pop();
				expect(current).toBeLessThanOrEqual(last);
				last = current;
				--heap_size;
			}
		}
	});


	it('should run 30000 finds in just a few milliseconds', () => {
		binHeap = new BinaryHeap(Mode.MIN);
		let i = 0;
		while (i < 30000) {
			binHeap.insert(i++);
		}
		while (i) {
			expect(binHeap.find(--i)).toEqual(i);
		}
	});


	it('should run 30000 removes in just a few milliseconds (if the O(1) algorithm works...)', () => {
		binHeap = new BinaryHeap(Mode.MIN);
		let i = 0;
		while (i < 30000) {
			binHeap.insert(i++);
		}
		while (i) {
			expect(binHeap.remove(--i)).toEqual(i);
		}
	});

});