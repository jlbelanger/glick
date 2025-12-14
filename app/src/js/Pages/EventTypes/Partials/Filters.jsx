import { Field } from '@jlbelanger/formosa';
import { getYmdFromDateObject } from '../../../Utilities/Datetime';
import PropTypes from 'prop-types';
import React from 'react';

export default function Filters({ chartRef, fromYmd, minDateObject, range, setFromYmd, setRange, setToYmd, toYmd }) {
	const zoomChart = (newFromDate, newToDate) => {
		const chart = chartRef.current;
		if (!chart || newFromDate.length < 10 || newToDate.length < 10) {
			return;
		}

		const newMinDateObject = new Date(`${newFromDate}T00:00:00`);
		const newMaxDateObject = new Date(`${newToDate}T23:59:59`);
		newMaxDateObject.setDate(newMaxDateObject.getDate() - 1);

		chart.zoomScale('x', { min: newMinDateObject.getTime(), max: newMaxDateObject.getTime() });
	};

	return (
		<>
			<Field
				label="Range:"
				name="range"
				type="radio"
				options={['day', 'week', 'month', 'year', 'all', 'custom']}
				value={range}
				setValue={(newRange) => {
					const today = new Date();
					today.setHours(0);
					today.setMinutes(0);
					today.setSeconds(0);

					let newFromDateObject = new Date(today.getTime());

					if (newRange === 'all' || newRange === 'custom') {
						newFromDateObject = minDateObject;
					} else if (newRange === 'week') {
						newFromDateObject.setDate(today.getDate() - 6);
					} else if (newRange === 'month') {
						newFromDateObject.setMonth(today.getMonth() - 1);
					} else if (newRange === 'year') {
						newFromDateObject.setFullYear(today.getFullYear() - 1);
					}

					const newToDateObject = new Date(today.getTime());
					newToDateObject.setDate(today.getDate() + 1);

					const newFromDateYmd = getYmdFromDateObject(newFromDateObject);
					const newToDateYmd = getYmdFromDateObject(newToDateObject);

					setRange(newRange);
					setFromYmd(newFromDateYmd);
					setToYmd(newToDateYmd);
					zoomChart(newFromDateYmd, newToDateYmd);
				}}
				wrapperClassName="range"
			/>
			{range !== 'all' && (
				<div className="chart-field-container" id="chart-filters">
					<Field
						aria-label="Filter by start date"
						label="From:"
						setValue={(v) => {
							setFromYmd(v);

							if (v.length < 10 || range === 'custom') {
								zoomChart(v, toYmd);
								return;
							}

							const newToDateObject = new Date(`${v}T00:00:00`);
							if (range === 'day') {
								newToDateObject.setDate(newToDateObject.getDate() + 1);
							} else if (range === 'week') {
								newToDateObject.setDate(newToDateObject.getDate() + 7);
							} else if (range === 'month') {
								newToDateObject.setMonth(newToDateObject.getMonth() + 1);
							} else if (range === 'year') {
								newToDateObject.setFullYear(newToDateObject.getFullYear() + 1);
							}
							const newToDateYmd = getYmdFromDateObject(newToDateObject);
							setToYmd(newToDateYmd);
							zoomChart(v, newToDateYmd);
						}}
						size={10}
						type="text"
						value={fromYmd}
						wrapperClassName="chart-field"
					/>
					<Field
						aria-label="Filter by end date"
						label="To:"
						setValue={(v) => {
							setToYmd(v);

							if (v.length < 10 || range === 'custom') {
								zoomChart(fromYmd, v);
								return;
							}

							const newFromDateObject = new Date(`${v}T00:00:00`);
							if (range === 'day') {
								newFromDateObject.setDate(newFromDateObject.getDate() - 1);
							} else if (range === 'week') {
								newFromDateObject.setDate(newFromDateObject.getDate() - 7);
							} else if (range === 'month') {
								newFromDateObject.setMonth(newFromDateObject.getMonth() - 1);
							} else if (range === 'year') {
								newFromDateObject.setFullYear(newFromDateObject.getFullYear() - 1);
							}
							const newFromDateYmd = getYmdFromDateObject(newFromDateObject);
							setFromYmd(newFromDateYmd);
							zoomChart(newFromDateYmd, v);
						}}
						size={10}
						type="text"
						value={toYmd}
						wrapperClassName="chart-field"
						wrapperAttributes={{
							style: {
								paddingLeft: 12,
							},
						}}
					/>
				</div>
			)}
		</>
	);
}

Filters.propTypes = {
	chartRef: PropTypes.object.isRequired,
	fromYmd: PropTypes.string.isRequired,
	minDateObject: PropTypes.object.isRequired,
	range: PropTypes.string.isRequired,
	setFromYmd: PropTypes.func.isRequired,
	setRange: PropTypes.func.isRequired,
	setToYmd: PropTypes.func.isRequired,
	toYmd: PropTypes.string.isRequired,
};
