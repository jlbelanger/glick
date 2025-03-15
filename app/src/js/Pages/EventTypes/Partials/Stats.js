import { getWeek, getYmdhmsFromDateObject } from '../../../Utilities/Datetime';
import { Field } from '@jlbelanger/formosa';
import { getChartTooltipFormat } from '../../../Utilities/Graph';
import PropTypes from 'prop-types';
import React from 'react';

const getPeriod = (dateObject, range) => {
	const ymdhms = getYmdhmsFromDateObject(dateObject);
	if (range === 'year') {
		return ymdhms.substring(0, 4);
	}
	if (range === 'month') {
		return ymdhms.substring(0, 7);
	}
	if (range === 'week') {
		return getWeek(dateObject);
	}
	if (range === 'day') {
		return ymdhms.substring(0, 10);
	}
	if (range === 'hour') {
		return ymdhms.substring(0, 13);
	}
	return null;
};

const createPeriodGroups = (minDateObject, maxDateObject, range) => {
	minDateObject.setMilliseconds(0);
	minDateObject.setMinutes(0);
	minDateObject.setSeconds(0);

	maxDateObject.setMilliseconds(0);
	maxDateObject.setMinutes(0);
	maxDateObject.setSeconds(0);

	if (range !== 'hour') {
		minDateObject.setHours(0);

		maxDateObject.setHours(0);

		if (range === 'week') {
			const weekday = minDateObject.getDay();
			if (weekday === 0) {
				minDateObject.setDate(minDateObject.getDate() - 6);
			} else {
				minDateObject.setDate(minDateObject.getDate() - weekday + 1);
			}
		} else if (range !== 'day') {
			minDateObject.setDate(1);

			maxDateObject.setDate(1);

			if (range !== 'month') {
				minDateObject.setMonth(0);

				maxDateObject.setMonth(0);
			}
		}
	}

	const output = {};
	output[getPeriod(minDateObject, range)] = [];

	while (minDateObject < maxDateObject) {
		if (range === 'year') {
			minDateObject.setFullYear(minDateObject.getFullYear() + 1);
		} else if (range === 'month') {
			minDateObject.setMonth(minDateObject.getMonth() + 1);
		} else if (range === 'week' || range === 'day') {
			minDateObject.setDate(minDateObject.getDate() + 1);
		} else if (range === 'hour') {
			minDateObject.setHours(minDateObject.getHours() + 1);
		}

		output[getPeriod(minDateObject, range)] = [];
	}

	return output;
};

const groupByPeriod = (output, rows, range) => {
	rows.forEach((row) => {
		output[getPeriod(row.dateObject, range)].push(row.value);
	});

	// Remove the last period if there are no events.
	const periods = Object.keys(output);
	const period = periods[periods.length - 1];
	if (output[period].length <= 0) {
		delete output[period];
	}

	return output;
};

const round = (value) => {
	if (Math.floor(value) === Math.ceil(value)) {
		return Math.round(value).toLocaleString();
	}
	return parseFloat(value.toFixed(1)).toLocaleString();
};

const calculate = (values) => {
	// Calculate the average.
	const numValues = values.length;
	values = values.sort((a, b) => (a - b));
	const sum = values.reduce((partialSum, n) => (partialSum + n), 0);
	const average = round(sum / numValues);

	// Calculate the median.
	const i = (numValues - 1) / 2;
	let median;
	if (numValues % 2 === 0) {
		median = round((values[Math.floor(i)] + values[Math.ceil(i)]) / 2);
	} else {
		median = round(values[i]);
	}

	return {
		average,
		median,
		min: values[0],
		max: values[numValues - 1],
	};
};

export default function Stats({ actions, chartRef, fromYmd, graphType, setUnit, suffix = '', toYmd, total, unit }) {
	const rows = actions;

	let results = {};

	if (graphType === 'bar') {
		let groupedRows = createPeriodGroups(new Date(`${fromYmd}T00:00:00`), new Date(`${toYmd}T23:59:59`), unit);
		groupedRows = groupByPeriod(groupedRows, rows, unit);

		const numPerPeriod = {};
		Object.keys(groupedRows).forEach((key) => {
			numPerPeriod[key] = Object.values(groupedRows[key]).length;
		});

		results = calculate(Object.values(numPerPeriod));
	} else if (graphType === 'line') {
		const values = [];
		const valuesSlash = {};
		let hasSlash = true;

		Object.values(actions).forEach((action) => {
			if (/^[0-9./]+\/[0-9./]+$/.test(action.value)) {
				values.push(parseFloat(action.value));
				action.value.split('/').forEach((value, i) => {
					if (!Object.prototype.hasOwnProperty.call(valuesSlash, i)) {
						valuesSlash[i] = [];
					}
					valuesSlash[i].push(parseFloat(value));
				});
			} else {
				values.push(parseFloat(action.value));
				hasSlash = false;
			}
		});

		if (hasSlash) {
			const slashResults = {};

			Object.values(valuesSlash).forEach((vals) => {
				const res = calculate(vals);
				Object.keys(res).forEach((key) => {
					if (!Object.prototype.hasOwnProperty.call(slashResults, key)) {
						slashResults[key] = [];
					}
					slashResults[key].push(res[key]);
				});
			});

			Object.keys(slashResults).forEach((key) => {
				results[key] = slashResults[key].join('/');
			});
		} else {
			results = calculate(values);
		}
	}

	return (
		<>
			<div className="chart-field-container" id="chart-stats">
				<div className="stat">
					{`Average: ${results.average === undefined ? '?' : results.average} ${suffix || ''}`.trim()}
				</div>
				<div className="stat">
					{`Median: ${results.median === undefined ? '?' : results.median} ${suffix || ''}`.trim()}
				</div>
				<div className="stat">
					{`Min: ${results.min === undefined ? '?' : results.min} ${suffix || ''}`.trim()}
				</div>
				<div className="stat">
					{`Max: ${results.max === undefined ? '?' : results.max} ${suffix || ''}`.trim()}
				</div>
				<div className="stat">
					{`Total: ${total.toLocaleString()}`}
				</div>
			</div>
			{graphType === 'bar' && (
				<Field
					label="Per:"
					name="unit"
					type="radio"
					options={['day', 'week', 'month', 'year']}
					value={unit}
					setValue={(v) => {
						const chart = chartRef.current;
						if (chart) {
							chart.options.scales.x.time.unit = v;
							chart.options.scales.x.time.tooltipFormat = getChartTooltipFormat(v);
						}

						setUnit(v);
					}}
					wrapperClassName="unit"
				/>
			)}
		</>
	);
}

Stats.propTypes = {
	actions: PropTypes.array.isRequired,
	chartRef: PropTypes.object.isRequired,
	fromYmd: PropTypes.string.isRequired,
	graphType: PropTypes.string.isRequired,
	setUnit: PropTypes.func.isRequired,
	suffix: PropTypes.string,
	toYmd: PropTypes.string.isRequired,
	total: PropTypes.number.isRequired,
	unit: PropTypes.string.isRequired,
};
