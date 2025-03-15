import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function Modal({
	cancelable = true,
	cancelButtonClass = 'button--secondary',
	cancelButtonText = 'Cancel',
	children = null,
	event,
	okButtonClass = '',
	okButtonText = 'OK',
	onClickCancel = null,
	onClickOk = null,
	text = null,
}) {
	const dialogRef = useRef(null);

	const onKeydown = (e) => {
		if (e.key === 'Escape' && onClickCancel) {
			onClickCancel();
		}
	};

	const onClickDialog = (e) => {
		if (e.target.tagName === 'DIALOG' && onClickCancel) {
			onClickCancel();
		}
	};

	useEffect(() => {
		document.body.classList.add('modal-open');

		if (cancelable) {
			document.addEventListener('keydown', onKeydown);
		}

		return () => {
			document.body.classList.remove('modal-open');

			if (cancelable) {
				document.removeEventListener('keydown', onKeydown);
			}

			if (event.target) {
				event.target.focus();
			}
		};
	}, []);

	useEffect(() => {
		if (dialogRef && dialogRef.current && dialogRef.current.getAttribute('open') === null) {
			dialogRef.current.showModal();
			dialogRef.current.focus();

			if (cancelable) {
				dialogRef.current.addEventListener('click', onClickDialog);
			}
		}
	}, [dialogRef]);

	return (
		<dialog className="modal" ref={dialogRef} tabIndex={-1}>
			<div className="modal__box">
				{children || (<p className="modal__text">{text}</p>)}
				<p className="modal__options">
					<button className={`formosa-button ${okButtonClass}`.trim()} onClick={onClickOk} type="button">
						{okButtonText}
					</button>
					<button className={`formosa-button ${cancelButtonClass}`.trim()} onClick={onClickCancel} type="button">
						{cancelButtonText}
					</button>
				</p>
			</div>
		</dialog>
	);
}

Modal.propTypes = {
	cancelable: PropTypes.bool,
	cancelButtonClass: PropTypes.string,
	cancelButtonText: PropTypes.string,
	children: PropTypes.node,
	event: PropTypes.object.isRequired,
	okButtonClass: PropTypes.string,
	okButtonText: PropTypes.string,
	onClickCancel: PropTypes.func,
	onClickOk: PropTypes.func,
	text: PropTypes.string,
};
