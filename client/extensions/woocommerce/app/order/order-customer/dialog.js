/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get, noop } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import AddressView from 'woocommerce/components/address-view';
import Button from 'components/button';
import Dialog from 'components/dialog';
// import FormCheckbox from 'components/forms/form-checkbox';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormLegend from 'components/forms/form-legend';
import FormPhoneMediaInput from 'components/forms/form-phone-media-input';
import FormTextInput from 'components/forms/form-text-input';
import getAddressViewFormat from 'woocommerce/lib/get-address-view-format';

// @todo Update this to use our store countries list
import countriesListBuilder from 'lib/countries-list';
const countriesList = countriesListBuilder.forPayments();

class CustomerAddressDialog extends Component {
	static propTypes = {
		address: PropTypes.shape( {
			address_1: PropTypes.string.isRequired,
			address_2: PropTypes.string,
			city: PropTypes.string.isRequired,
			state: PropTypes.string,
			country: PropTypes.string.isRequired,
			postcode: PropTypes.string,
			email: PropTypes.string,
			first_name: PropTypes.string.isRequired,
			last_name: PropTypes.string.isRequired,
			phone: PropTypes.string,
		} ),
		isVisible: PropTypes.bool,
		closeDialog: PropTypes.func,
		showPhoneEmail: PropTypes.bool,
	};

	static defaultProps = {
		address: {
			street: '',
			street2: '',
			city: '',
			state: 'AL',
			country: 'US',
			postcode: '',
			email: '',
			first_name: '',
			last_name: '',
			phone: '',
		},
		closeDialog: noop,
		isVisible: false,
		showPhoneEmail: false,
	};

	constructor( props ) {
		super( props );
		this.state = {
			address: props.address,
			phoneCountry: 'US',
		};
	}

	updateAddress = () => {
		this.props.updateAddress( this.state.address );
		this.props.closeDialog();
	};

	closeDialog = () => {
		this.props.closeDialog();
	};

	onPhoneChange = phone => {
		this.setState( prevState => {
			const { address } = prevState;
			const newState = { ...address, phone: phone.value };
			return { address: newState, phoneCountry: phone.countryCode };
		} );
	};

	onChange = event => {
		let name = event.target.name;
		if ( 'street' === event.target.name ) {
			name = 'address_1';
		} else if ( 'street2' === event.target.name ) {
			name = 'address_2';
		}
		const value = event.target.value;
		this.setState( prevState => {
			const { address } = prevState;
			const newState = { ...address, [ name ]: value };
			return { address: newState };
		} );
	};

	renderPhoneEmail = () => {
		const { showPhoneEmail, translate } = this.props;
		const { address } = this.state;
		if ( ! showPhoneEmail ) {
			return null;
		}
		return (
			<div>
				<FormFieldset>
					<FormPhoneMediaInput
						label={ translate( 'Phone Number' ) }
						onChange={ this.onPhoneChange }
						countryCode={ this.state.phoneCountry }
						countriesList={ countriesList }
						value={ get( address, 'phone', '' ) }
					/>
				</FormFieldset>
				<FormFieldset>
					<FormLabel htmlFor="email">{ translate( 'Email address' ) }</FormLabel>
					<FormTextInput
						id="email"
						name="email"
						value={ get( address, 'email', '' ) }
						onChange={ this.onChange }
					/>
				</FormFieldset>
			</div>
		);
	};

	render() {
		const { isVisible, translate } = this.props;
		const { address } = this.state;
		const dialogButtons = [
			<Button onClick={ this.closeDialog }>{ translate( 'Close' ) }</Button>,
			<Button primary onClick={ this.updateAddress }>
				{ translate( 'Save' ) }
			</Button>,
		];

		return (
			<Dialog
				isVisible={ isVisible }
				onClose={ this.closeDialog }
				className="order-customer__dialog woocommerce"
				buttons={ dialogButtons }
			>
				<FormFieldset>
					<FormLegend className="order-customer__billing-details">
						{ translate( 'Billing Details' ) }
					</FormLegend>
					<div className="order-customer__fieldset">
						<div className="order-customer__field">
							<FormLabel htmlFor="first_name">{ translate( 'First Name' ) }</FormLabel>
							<FormTextInput
								id="first_name"
								name="first_name"
								value={ get( address, 'first_name', '' ) }
								onChange={ this.onChange }
							/>
						</div>
						<div className="order-customer__field">
							<FormLabel htmlFor="last_name">{ translate( 'Last Name' ) }</FormLabel>
							<FormTextInput
								id="last_name"
								name="last_name"
								value={ get( address, 'last_name', '' ) }
								onChange={ this.onChange }
							/>
						</div>
					</div>
					<AddressView
						isEditable
						onChange={ this.onChange }
						address={ getAddressViewFormat( address ) }
					/>
					{ this.renderPhoneEmail() }
				</FormFieldset>
			</Dialog>
		);
	}
}

export default localize( CustomerAddressDialog );
