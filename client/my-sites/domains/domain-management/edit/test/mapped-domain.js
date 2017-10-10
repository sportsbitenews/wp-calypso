/** @format */
/**
 * External dependencies
 */
import assert from 'assert';
import { identity } from 'lodash';
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import sinon from 'sinon';

/**
 * Internal dependencies
 */
import { MappedDomain } from '../mapped-domain.jsx';

jest.mock( 'lib/analytics', () => {} );

describe( 'mapped-domain', () => {
	let props;

	before( () => {
		props = {
			selectedSite: {
				slug: 'neverexpires.wordpress.com',
				domain: 'neverexpires.com',
			},
			domain: {
				name: 'neverexpires.com',
				expirationMoment: null,
			},
			settingPrimaryDomain: false,
			translate: identity,
		};
	} );

	it( 'should render when props.domain.expirationMoment is null', () => {
		const renderer = createRenderer();
		renderer.render( <MappedDomain { ...props } /> );
		const out = renderer.getRenderOutput();

		assert( out );
	} );

	it(
		'should use selectedSite.slug for URLs',
		sinon.test( function() {
			const paths = require( 'my-sites/domains/paths' );
			const dnsStub = this.stub( paths, 'domainManagementDns' );
			const emailStub = this.stub( paths, 'domainManagementEmail' );

			const renderer = createRenderer();
			renderer.render( <MappedDomain { ...props } /> );
			renderer.getRenderOutput();

			assert( dnsStub.calledWith( 'neverexpires.wordpress.com', 'neverexpires.com' ) );
			assert( emailStub.calledWith( 'neverexpires.wordpress.com', 'neverexpires.com' ) );
		} )
	);
} );
