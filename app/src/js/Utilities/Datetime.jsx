import { DateTime } from 'luxon';

export const getYmdhmszFromLocalYmdhms = (ymdhms) => {
	const dateObject = new Date();
	dateObject.setFullYear(ymdhms.substring(0, 4));
	dateObject.setMonth(parseInt(ymdhms.substring(5, 7), 10) - 1);
	dateObject.setDate(ymdhms.substring(8, 10));
	dateObject.setHours(ymdhms.substring(11, 13));
	dateObject.setMinutes(ymdhms.substring(14, 16));
	dateObject.setSeconds(ymdhms.substring(17, 19));
	return dateObject.toISOString().substring(0, 19).replace('T', ' ');
};

export const getCurrentYmdhmsz = () => (
	new Date().toISOString().substring(0, 19).replace('T', ' ')
);

export const pad = (n, width = 2, z = '0') => {
	z = z || '0';
	n = n.toString();
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

export const getYmdFromDateObject = (dateObject) => {
	const year = dateObject.getFullYear();
	const month = pad(dateObject.getMonth() + 1);
	const day = pad(dateObject.getDate());
	return `${year}-${month}-${day}`;
};

export const getYmdhmsFromDateObject = (dateObject) => {
	const year = dateObject.getFullYear();
	const month = pad(dateObject.getMonth() + 1);
	const day = pad(dateObject.getDate());
	const hours = pad(dateObject.getHours());
	const minutes = pad(dateObject.getMinutes());
	const seconds = pad(dateObject.getSeconds());
	const output = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	return output;
};

export const getLocalYmdFromYmdhmsz = (ymdhmsz) => {
	const dateObject = new Date(`${ymdhmsz.replace(' ', 'T')}.000Z`);
	return getYmdFromDateObject(dateObject);
};

export const getLocalYmdmsFromYmdhmsz = (ymdhmsz) => {
	const dateObject = new Date(`${ymdhmsz.replace(' ', 'T')}.000Z`);
	return getYmdhmsFromDateObject(dateObject);
};

export const getLocalDateObject = (ymdhmsz) => (
	new Date(`${ymdhmsz.replace(' ', 'T')}.000Z`)
);

export const prettyDate = (ymd) => (
	new Date(`${ymd}T12:00:00.000Z`).toLocaleString('en-CA', {
		weekday: 'short',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
);

export const prettyDatetime = (ymdhmsz) => (
	new Date(`${ymdhmsz.replace(' ', 'T')}.000Z`)
		.toLocaleString('en-CA', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		})
		.replace('a.m.', 'AM')
		.replace('p.m.', 'PM')
);

export const prettyTime = (ymdhmsz) => (
	new Date(`${ymdhmsz.replace(' ', 'T')}.000Z`)
		.toLocaleTimeString('en-CA', {
			hour: 'numeric',
			minute: 'numeric',
		})
		.replace('a.m.', 'AM')
		.replace('p.m.', 'PM')
);

export const isToday = (ymdhmsz) => (
	getLocalYmdFromYmdhmsz(ymdhmsz) === getYmdFromDateObject(new Date())
);

export const getRowsByYmd = (rows) => {
	const output = {};
	rows.forEach((row) => {
		const ymd = getLocalYmdFromYmdhmsz(row.start_date);
		if (!Object.prototype.hasOwnProperty.call(output, ymd)) {
			output[ymd] = [];
		}
		output[ymd].push(row);
	});
	return output;
};

export const getWeek = (dateObject) => {
	const luxonDate = DateTime.fromJSDate(dateObject);
	return `${luxonDate.weekYear}-w${pad(luxonDate.weekNumber)}`;
};
