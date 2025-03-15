import { React, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function MetaTitle({
	children = null,
	hideTitleText = false,
	title = '',
}) {
	useEffect(() => {
		let metaTitle = title;
		if (process.env.REACT_APP_TITLE) {
			if (metaTitle) {
				metaTitle += ' | ';
			}
			metaTitle += process.env.REACT_APP_TITLE;
		}
		document.querySelector('title').innerText = metaTitle;
	}, [title]);

	if (hideTitleText) {
		return (
			<div id="heading-spacer" />
		);
	}

	return (
		<>
			<div id="heading">
				<div id="heading-inner">
					<h1 id="heading-title">{title}</h1>
					{children}
				</div>
			</div>
			<div id="heading-spacer" />
		</>
	);
}

MetaTitle.propTypes = {
	children: PropTypes.node,
	hideTitleText: PropTypes.bool,
	title: PropTypes.string,
};
