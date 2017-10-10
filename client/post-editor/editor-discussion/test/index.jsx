/**
 * @format
 * @jest-environment jsdom
 */

/**
 * External dependencies
 */
import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDom from 'react-dom';
import sinon from 'sinon';

/**
 * Internal dependencies
 */
import EditorDiscussion from '../';
import { edit as editPost } from 'lib/posts/actions';

jest.mock( 'components/info-popover', () => require( 'components/empty-component' ) );
jest.mock( 'lib/posts/actions', () => ( {
	edit: require( 'sinon' ).spy(),
} ) );
jest.mock( 'lib/posts/stats', () => ( {
	recordEvent: () => {},
	recordStat: () => {},
} ) );

/**
 * Module variables
 */
const DUMMY_SITE = {
	options: {
		default_comment_status: true,
		default_ping_status: false,
	},
};

describe( 'EditorDiscussion', () => {
	beforeAll( function() {
		EditorDiscussion.prototype.translate = sinon.stub().returnsArg( 0 );
	} );

	beforeEach( () => {
		ReactDom.unmountComponentAtNode( document.body );
	} );

	afterAll( function() {
		delete EditorDiscussion.prototype.translate;
	} );

	describe( '#getDiscussionSetting()', () => {
		test( 'should return an empty object if both post and site are unknown', () => {
			var tree = TestUtils.renderIntoDocument( <EditorDiscussion /> );

			expect( tree.getDiscussionSetting() ).to.eql( {} );
		} );

		test( 'should return the site default comments open if site exists and post is new', () => {
			var site = {
					options: {
						default_comment_status: true,
						default_ping_status: false,
					},
				},
				post = {
					type: 'post',
				},
				tree;

			tree = TestUtils.renderIntoDocument( <EditorDiscussion site={ site } post={ post } isNew /> );

			expect( tree.getDiscussionSetting() ).to.eql( {
				comment_status: 'open',
				ping_status: 'closed',
			} );
		} );

		test( 'should return the site default pings open if site exists and post is new', () => {
			var site = {
					options: {
						default_comment_status: false,
						default_ping_status: true,
					},
				},
				post = {
					type: 'post',
				},
				tree;

			tree = TestUtils.renderIntoDocument( <EditorDiscussion site={ site } post={ post } isNew /> );

			expect( tree.getDiscussionSetting() ).to.eql( {
				comment_status: 'closed',
				ping_status: 'open',
			} );
		} );

		test( 'should return comments closed if site exists, post is new, and post is type page', () => {
			var site = {
					options: {
						default_comment_status: false,
						default_ping_status: true,
					},
				},
				post = {
					type: 'page',
				},
				tree;

			tree = TestUtils.renderIntoDocument( <EditorDiscussion site={ site } post={ post } isNew /> );

			expect( tree.getDiscussionSetting() ).to.eql( {
				comment_status: 'closed',
				ping_status: 'closed',
			} );
		} );

		test( 'should return the saved post values', () => {
			var post = {
					discussion: {
						comment_status: 'open',
						ping_status: 'closed',
					},
				},
				tree;

			tree = TestUtils.renderIntoDocument( <EditorDiscussion post={ post } site={ DUMMY_SITE } /> );

			expect( tree.getDiscussionSetting() ).to.equal( post.discussion );
		} );
	} );

	describe( '#onChange', () => {
		var post = {
			discussion: {
				comment_status: 'closed',
				comments_open: false,
				ping_status: 'open',
				pings_open: true,
			},
		};

		test( 'should include modified comment status on the post object', () => {
			var tree, checkbox;

			tree = TestUtils.renderIntoDocument(
				<EditorDiscussion
					post={ post }
					site={ DUMMY_SITE }
					setDiscussionSettings={ function() {} }
				/>
			);

			checkbox = ReactDom.findDOMNode( tree ).querySelector( '[name=ping_status]' );
			TestUtils.Simulate.change( checkbox, {
				target: {
					name: 'comment_status',
					checked: true,
				},
			} );

			expect( editPost ).to.have.been.calledWith( {
				discussion: {
					comment_status: 'open',
					ping_status: 'open',
				},
			} );
		} );

		test( 'should include modified ping status on the post object', () => {
			var tree, checkbox;

			tree = TestUtils.renderIntoDocument(
				<EditorDiscussion
					post={ post }
					site={ DUMMY_SITE }
					setDiscussionSettings={ function() {} }
				/>
			);

			checkbox = ReactDom.findDOMNode( tree ).querySelector( '[name=ping_status]' );
			TestUtils.Simulate.change( checkbox, {
				target: {
					name: 'ping_status',
					checked: false,
				},
			} );

			expect( editPost ).to.have.been.calledWith( {
				discussion: {
					comment_status: 'closed',
					ping_status: 'closed',
				},
			} );
		} );
	} );
} );
