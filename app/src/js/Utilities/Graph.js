export const getChartUnit = (fromDateObject, toDateObject) => {
	const min = fromDateObject.getTime();
	const max = toDateObject.getTime();
	const diff = max - min;
	const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
	let unit = 'year';
	if (diff <= oneDayInMilliseconds) {
		unit = 'hour';
	} else if (diff <= (oneDayInMilliseconds * 7)) {
		unit = 'day';
	} else if (diff <= (oneDayInMilliseconds * 31)) {
		unit = 'week';
	} else if (diff <= (oneDayInMilliseconds * 365)) {
		unit = 'month';
	}
	return unit;
};

export const getDefaultChartUnit = (fromDateObject, toDateObject) => {
	const min = fromDateObject.getTime();
	const max = toDateObject.getTime();
	const diff = max - min;
	const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
	let unit = 'year';
	if (diff <= (oneDayInMilliseconds * 7)) {
		unit = 'day';
	} else if (diff <= (oneDayInMilliseconds * 31)) {
		unit = 'week';
	} else if (diff <= (oneDayInMilliseconds * 365 * 5)) {
		unit = 'month';
	}
	return unit;
};

export const getChartTooltipFormat = (unit) => {
	if (unit === 'year') {
		return 'yyyy';
	}
	if (unit === 'month') {
		return 'MMM yyyy';
	}
	if (unit === 'week') {
		return 'yyyy \'W\'W';
	}
	if (unit === 'day') {
		return 'MMM d, yyyy';
	}
	return 'MMM d, yyyy h:mm a';
};

export const getGraphType = (actionType) => {
	if (actionType.field_type === 'button' && !actionType.is_continuous) {
		return 'bar';
	}
	if (actionType.field_type === 'number') {
		return 'line';
	}
	if (actionType.field_type === 'text') {
		let output = 'line';
		actionType.actions.forEach((action) => {
			if (!/^[0-9./]+$/.test(action.value)) {
				output = 'bar';
			}
		});
		return output;
	}
	return '';
};

export const barGraphData = (actions, unit) => {
	const data = {};
	actions.forEach((action) => {
		const dateObject = new Date(action.dateObject.getTime());
		if (unit === 'year') {
			dateObject.setSeconds(0);
			dateObject.setMinutes(0);
			dateObject.setHours(0);
			dateObject.setDate(1);
			dateObject.setMonth(0);
		} else if (unit === 'month') {
			dateObject.setSeconds(0);
			dateObject.setMinutes(0);
			dateObject.setHours(0);
			dateObject.setDate(1);
		} else if (unit === 'week') {
			dateObject.setSeconds(0);
			dateObject.setMinutes(0);
			dateObject.setHours(0);
			const weekday = dateObject.getDay();
			if (weekday === 0) {
				dateObject.setDate(dateObject.getDate() - 6);
			} else if (weekday !== 1) {
				dateObject.setDate(dateObject.getDate() - (weekday - 1));
			}
		} else if (unit === 'day') {
			dateObject.setSeconds(0);
			dateObject.setMinutes(0);
			dateObject.setHours(0);
		}
		const ymdhmsz = dateObject.toISOString();
		if (Object.prototype.hasOwnProperty.call(data, ymdhmsz)) {
			data[ymdhmsz] += 1;
		} else {
			data[ymdhmsz] = 1;
		}
	});

	const labels = [];
	Object.keys(data).forEach((ymdhmsz) => {
		labels.push(new Date(ymdhmsz));
	});

	return {
		labels,
		datasets: [
			{
				backgroundColor: '#3c9',
				data: Object.values(data),
			},
		],
	};
};

export const lineGraphData = (actionType, actions) => {
	const output = {
		labels: [],
		datasets: [],
	};
	const colors = [
		'#3c9', // green
		'#3f51b5', // blue
		'#f44336', // red
		'#ff9800', // orange
		'#9c27b0', // purple
		'#03a9f4', // cyan
		'#f06292', // pink
		'#ffeb3b', // yellow
		'#8bc34a', // lime
		'#00bcd4', // teal
		'#673ab7', // purple
	];

	const points = [];
	if (actionType.field_type === 'number') {
		points.push([]);
	}

	actions.forEach((action) => {
		output.labels.push(action.dateObject);
		if (/^[0-9./]+$/.test(action.value)) {
			action.value.split('/').forEach((value, i) => {
				if (points.length < (i + 1)) {
					points.push([]);
				}
				points[i].push(value);
			});
		} else if (actionType.field_type === 'number') {
			points[0].push(action.value);
		}
	});

	if (points.length <= 0) {
		return null;
	}

	points.forEach((pointsList, i) => {
		output.datasets.push({
			backgroundColor: colors[i],
			borderColor: colors[i],
			borderWidth: 2,
			borderCapStyle: 'round',
			fill: false,
			data: pointsList,
		});
	});

	return output;
};
