/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Gridicon from 'gridicons';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import formatCurrency from 'lib/format-currency';
import { getOrderRefundTotal } from 'woocommerce/lib/order-values';
import { isOrderWaitingPayment } from 'woocommerce/lib/order-status';
import RefundDialog from './dialog';
import { updateOrder } from 'woocommerce/state/sites/orders/actions';

class OrderPaymentCard extends Component {
	static propTypes = {
		order: PropTypes.shape( {
			currency: PropTypes.string.isRequired,
			id: PropTypes.number.isRequired,
			payment_method_title: PropTypes.string.isRequired,
			refunds: PropTypes.array.isRequired,
			status: PropTypes.string.isRequired,
			total: PropTypes.string.isRequired,
		} ),
		siteId: PropTypes.number.isRequired,
		translate: PropTypes.func.isRequired,
		updateOrder: PropTypes.func.isRequired,
	};

	state = {
		showDialog: false,
	};

	getPaymentStatus = () => {
		const { order, translate } = this.props;
		let paymentStatus;

		if ( 'refunded' === order.status ) {
			paymentStatus = translate( 'Payment of %(total)s has been refunded', {
				args: {
					total: formatCurrency( order.total, order.currency ),
				},
			} );
		} else if ( 'on-hold' === order.status || 'pending' === order.status ) {
			paymentStatus = translate( 'Awaiting payment of %(total)s via %(method)s', {
				args: {
					total: formatCurrency( order.total, order.currency ),
					method: order.payment_method_title,
				},
			} );
		} else if ( order.refunds.length ) {
			const refund = getOrderRefundTotal( order );
			paymentStatus = translate( 'Payment of %(total)s has been partially refunded %(refund)s', {
				args: {
					total: formatCurrency( order.total, order.currency ),
					refund: formatCurrency( refund, order.currency ),
				},
			} );
		} else {
			paymentStatus = translate( 'Payment of %(total)s received via %(method)s', {
				args: {
					total: formatCurrency( order.total, order.currency ),
					method: order.payment_method_title,
				},
			} );
		}
		return paymentStatus;
	};

	getPaymentAction = () => {
		const { order, translate } = this.props;
		if ( 'refunded' === order.status ) {
			return null;
		} else if ( isOrderWaitingPayment( order.status ) ) {
			return <Button onClick={ this.markAsPaid }>{ translate( 'Mark as Paid' ) }</Button>;
		}
		return <Button onClick={ this.toggleDialog }>{ translate( 'Submit Refund' ) }</Button>;
	};

	markAsPaid = () => {
		const { order, siteId } = this.props;
		this.props.updateOrder( siteId, { ...order, status: 'processing' } );
	};

	toggleDialog = () => {
		this.setState( prevState => ( {
			showDialog: ! prevState.showDialog,
		} ) );
	};

	render() {
		const { order } = this.props;

		if ( 'cancelled' === order.status || 'failed' === order.status ) {
			return null;
		}

		return (
			<div className="order-payment">
				<div className="order-payment__label">
					<Gridicon icon="checkmark" />
					{ this.getPaymentStatus() }
				</div>
				<div className="order-payment__action">{ this.getPaymentAction() }</div>

				<RefundDialog
					isVisible={ this.state.showDialog }
					order={ order }
					toggleDialog={ this.toggleDialog }
				/>
			</div>
		);
	}
}

export default connect( null, dispatch => bindActionCreators( { updateOrder }, dispatch ) )(
	localize( OrderPaymentCard )
);
