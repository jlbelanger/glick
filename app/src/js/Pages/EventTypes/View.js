import 'luxon';
import 'chartjs-adapter-luxon'; // eslint-disable-line import/no-unresolved
import {
	BarController,
	BarElement,
	Chart as ChartJS,
	LinearScale,
	LineController,
	LineElement,
	PointElement,
	TimeScale,
	Tooltip,
} from 'chart.js';
import { barGraphData, getChartTooltipFormat, getDefaultChartUnit, getGraphType, lineGraphData } from '../../Utilities/Graph';
import { getLocalDateObject, getRowsByYmd, getYmdFromDateObject, getYmdhmsFromDateObject } from '../../Utilities/Datetime';
import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Api } from '@jlbelanger/formosa';
import { Chart } from 'react-chartjs-2'; // eslint-disable-line import/no-unresolved
import Error from '../../Error';
import Filters from './Partials/Filters';
import MetaTitle from '../../Components/MetaTitle';
import Row from '../Events/Partials/Row';
import Stats from './Partials/Stats';
import zoomPlugin from 'chartjs-plugin-zoom';

const convertToCurrentTimezone = (rows) => {
	const output = [];

	rows.forEach((row) => {
		output.push({
			...row,
			dateObject: getLocalDateObject(row.start_date),
		});
	});

	return output;
};

const filterByDates = (rows, fromYmd, toYmd) => {
	const output = [];
	const toDateObject = new Date(`${toYmd}T00:00:00`);
	toDateObject.setDate(toDateObject.getDate() - 1);
	const fromYmdhms = `${fromYmd} 00:00:00`;
	const toYmdhms = `${getYmdFromDateObject(toDateObject)} 23:59:59`;

	rows.forEach((row) => {
		const ymdhms = getYmdhmsFromDateObject(row.dateObject);
		if (ymdhms >= fromYmdhms && ymdhms <= toYmdhms) {
			output.push(row);
		}
	});

	return output;
};

export default function View() {
	const api = Api.instance();
	const { id } = useParams();
	const chartRef = useRef(null);
	const [row, setRow] = useState(null);
	const [actions, setActions] = useState([]);
	const [error, setError] = useState(false);
	const [graphData, setGraphData] = useState(null);
	const [graphOptions, setGraphOptions] = useState(null);
	const [graphType, setGraphType] = useState('');
	const [minDateObject, setMinDateObject] = useState(null);
	const defaultDateObject = useMemo(() => (new Date()));
	const [fromYmd, setFromYmd] = useState(getYmdFromDateObject(defaultDateObject));
	const [toYmd, setToYmd] = useState(getYmdFromDateObject(defaultDateObject));
	const [range, setRange] = useState('all');
	const [unit, setUnit] = useState('day');

	useEffect(() => {
		let ignore = false;

		if (id) {
			api(`action-types/${id}?include=actions,actions.option`)
				.catch((response) => {
					setError(response);
				})
				.then((response) => {
					if (ignore || !response) {
						return;
					}

					setRow(response);

					const newActions = convertToCurrentTimezone(response.actions);
					newActions.forEach((action) => {
						action.action_type = response;
					});
					setActions(newActions);

					let minTimestamp = null;
					let maxTimestamp = null;
					let minX = null;
					let maxX = null;
					newActions.forEach((action) => {
						const timestamp = action.dateObject.getTime();
						if (!minX || timestamp < minX) {
							minX = timestamp;
						}
						if (!maxX || timestamp > maxX) {
							maxX = timestamp;
						}
						if (!minTimestamp || timestamp < minTimestamp) {
							minTimestamp = timestamp;
						}
						if (!maxTimestamp || timestamp > maxTimestamp) {
							maxTimestamp = timestamp;
						}
					});
					const newMinDateObject = new Date(minTimestamp);
					const newMaxDateObject = new Date(maxTimestamp);
					newMaxDateObject.setDate(newMaxDateObject.getDate() + 1);

					const newUnit = getDefaultChartUnit(newMinDateObject, defaultDateObject);

					let data = null;
					const newGraphType = getGraphType(response);
					if (newGraphType === 'bar') {
						data = barGraphData(newActions, newUnit);
					} else if (newGraphType === 'line') {
						data = lineGraphData(response, newActions);
					}

					const newGraphOptions = {
						maintainAspectRatio: false,
						scales: {
							x: {
								bounds: 'data',
								time: {
									displayFormats: {
										week: getChartTooltipFormat('week'),
									},
									tooltipFormat: newGraphType === 'bar' ? getChartTooltipFormat(newUnit) : getChartTooltipFormat('second'),
									unit: newUnit,
								},
								type: 'time',
							},
							y: {
								beginAtZero: newGraphType === 'bar',
								bounds: 'data',
								ticks: {
									precision: newGraphType === 'bar' ? 0 : null,
								},
								type: 'linear',
							},
						},
						plugins: {
							legend: {
								display: false,
							},
							zoom: {
								limits: {
									x: {
										min: minX,
										max: maxX,
									},
									y: {
										min: newGraphType === 'bar' ? 0 : null,
									},
								},
								pan: {
									enabled: false,
								},
								zoom: {
									mode: 'x',
									pinch: {
										enabled: true,
									},
									wheel: {
										enabled: false,
									},
								},
							},
						},
					};

					ChartJS.register(
						BarController,
						BarElement,
						LineController,
						LineElement,
						LinearScale,
						PointElement,
						TimeScale,
						Tooltip,
						zoomPlugin
					);

					setMinDateObject(newMinDateObject);
					setFromYmd(getYmdFromDateObject(newMinDateObject));
					setToYmd(getYmdFromDateObject(newMaxDateObject));
					setUnit(newUnit);
					setGraphData(data);
					setGraphOptions(newGraphOptions);
					setGraphType(newGraphType);
				});
		}

		return () => {
			ignore = true;
		};
	}, [id]);

	if (error) {
		return (
			<Error error={error} />
		);
	}

	if (row === null) {
		return (
			<MetaTitle title="Loading..." />
		);
	}

	let rows = actions;
	if ((minDateObject && getYmdFromDateObject(minDateObject) !== fromYmd) || getYmdFromDateObject(defaultDateObject) !== toYmd) {
		rows = filterByDates(rows, fromYmd, toYmd);
	}
	const rowsByYmd = getRowsByYmd(rows);
	const total = rows.length;

	return (
		<>
			<MetaTitle title={row.label}>
				<Link to={`/event-types/${row.id}/edit`}>Edit</Link>
			</MetaTitle>

			<Filters
				chartRef={chartRef}
				fromYmd={fromYmd}
				minDateObject={minDateObject}
				range={range}
				setFromYmd={setFromYmd}
				setRange={setRange}
				setToYmd={setToYmd}
				toYmd={toYmd}
			/>

			{graphData && graphOptions && graphType && (
				<>
					<div id="chart-container">
						<Chart
							ref={chartRef}
							data={graphData}
							id="chart"
							options={graphOptions}
							type={graphType}
						/>
					</div>

					<Stats
						actions={rows}
						chartRef={chartRef}
						fromYmd={fromYmd}
						graphType={graphType}
						setUnit={(v) => {
							if (graphType === 'bar') {
								setGraphData(barGraphData(actions, v));
							}
							setUnit(v);
						}}
						suffix={row.suffix}
						toYmd={toYmd}
						total={total}
						unit={unit}
					/>
				</>
			)}

			{total > 0 ? (
				<table>
					<tbody>
						{Object.keys(rowsByYmd).map((ymd) => (
							<Row key={ymd} rows={rowsByYmd[ymd]} ymd={ymd} />
						))}
					</tbody>
				</table>
			) : (
				<p>No events found.</p>
			)}
		</>
	);
}
