import React, { useEffect, useState } from 'react';
import { Api } from '@jlbelanger/formosa';
import Error from '../../Error';
import { getRowsByYmd } from '../../Utilities/Datetime';
import { Link } from 'react-router-dom';
import MetaTitle from '../../Components/MetaTitle';
import Row from './Partials/Row';

export default function List() {
	const api = Api.instance();
	const [rows, setRows] = useState(null);
	const [error, setError] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);

	const getActions = () => {
		api(`actions?include=action_type,option&page[number]=${currentPage}&page[size]=100`)
			.catch((response) => {
				setError(response);
			})
			.then((response) => {
				if (!response) {
					return;
				}
				setHasMore(currentPage < response.meta.page.total_pages);
				if (!Object.prototype.hasOwnProperty.call(response, 'data')) {
					setRows([]);
				} else if (rows === null) {
					setRows(response.data);
				} else {
					setRows([...rows, ...response.data]);
				}
				setLoading(false);
			});
	};

	const debounce = (func, wait, immediate) => {
		let timeout;
		return function (...args) { // eslint-disable-line func-names
			const context = this;
			const later = () => {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};
			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) {
				func.apply(context, args);
			}
		};
	};

	const onScroll = () => {
		if (loading || !hasMore) {
			return;
		}

		const pxFromTop = document.documentElement.scrollTop;
		const pageHeight = document.documentElement.scrollHeight;
		const browserHeight = document.documentElement.clientHeight;

		if ((pxFromTop + (browserHeight * 2)) >= pageHeight) {
			setCurrentPage((oldVal) => (oldVal + 1));
		}
	};

	const debouncedOnScroll = debounce(onScroll, 100);

	useEffect(() => {
		setLoading(true);
		getActions();
	}, [currentPage]);

	useEffect(() => {
		window.addEventListener('scroll', debouncedOnScroll);
		return () => {
			window.removeEventListener('scroll', debouncedOnScroll);
		};
	}, []);

	if (error) {
		return (
			<Error error={error} />
		);
	}

	if (rows === null) {
		return (
			<MetaTitle title="Past events" />
		);
	}

	const rowsByYmd = getRowsByYmd(rows);

	return (
		<>
			<MetaTitle title="Past events">
				<Link to="/">+ Add New</Link>
			</MetaTitle>

			{rows.length > 0 ? (
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
