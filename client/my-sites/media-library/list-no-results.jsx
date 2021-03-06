/**
 * External dependencies
 *
 * @format
 */

import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import React from 'react';

/**
 * Internal dependencies
 */
import NoResults from 'my-sites/no-results';

module.exports = localize(
	React.createClass( {
		displayName: 'MediaLibraryListNoResults',

		propTypes: {
			filter: PropTypes.string,
			search: PropTypes.string,
		},

		getDefaultProps: function() {
			return {
				search: '',
			};
		},

		getLabel: function() {
			var label;

			switch ( this.props.filter ) {
				case 'images':
					label = this.props.translate( 'No images match your search for {{searchTerm/}}.', {
						components: {
							searchTerm: <em>{ this.props.search }</em>,
						},
						context: 'Media no search results',
					} );
					break;
				case 'videos':
					label = this.props.translate( 'No videos match your search for {{searchTerm/}}.', {
						components: {
							searchTerm: <em>{ this.props.search }</em>,
						},
						context: 'Media no search results',
					} );
					break;
				case 'audio':
					label = this.props.translate( 'No audio files match your search for {{searchTerm/}}.', {
						components: {
							searchTerm: <em>{ this.props.search }</em>,
						},
						context: 'Media no search results',
					} );
					break;
				case 'documents':
					label = this.props.translate( 'No documents match your search for {{searchTerm/}}.', {
						components: {
							searchTerm: <em>{ this.props.search }</em>,
						},
						context: 'Media no search results',
					} );
					break;
				default:
					label = this.props.translate( 'No media files match your search for {{searchTerm/}}.', {
						components: {
							searchTerm: <em>{ this.props.search }</em>,
						},
						context: 'Media no search results',
					} );
					break;
			}

			return label;
		},

		render: function() {
			return (
				<NoResults text={ this.getLabel() } image="/calypso/images/pages/illustration-pages.svg" />
			);
		},
	} )
);
