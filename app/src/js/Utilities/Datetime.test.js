import { getWeek } from './Datetime';

describe('getWeek', () => {
	const items = [
		{ date: '2023-01-01T08:00:00Z', expected: '2022-w52' },
		{ date: '2023-01-02T08:00:00Z', expected: '2023-w01' },
		{ date: '2023-01-03T08:00:00Z', expected: '2023-w01' },
		{ date: '2023-01-04T08:00:00Z', expected: '2023-w01' },
		{ date: '2023-01-05T08:00:00Z', expected: '2023-w01' },
		{ date: '2023-01-06T08:00:00Z', expected: '2023-w01' },
		{ date: '2023-01-07T08:00:00Z', expected: '2023-w01' },
		{ date: '2023-01-08T08:00:00Z', expected: '2023-w01' },
		{ date: '2023-01-09T08:00:00Z', expected: '2023-w02' },
	];
	items.forEach((item) => {
		it(`returns correct week for ${item.date}`, async () => {
			expect(getWeek(new Date(item.date))).toEqual(item.expected);
		});
	});
});
