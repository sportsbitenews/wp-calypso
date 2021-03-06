/**
 * External dependencies
 *
 * @format
 */

import { filter, find } from 'lodash';
import { localize } from 'i18n-calypso';
import React from 'react';
import titleCase from 'to-title-case';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import analytics from 'lib/analytics';
import Card from 'components/card';
import SectionNav from 'components/section-nav';
import NavTabs from 'components/section-nav/tabs';
import NavItem from 'components/section-nav/item';

module.exports = localize(
	React.createClass( {
		_COLLAPSED_DESCRIPTION_HEIGHT: 140,

		displayName: 'PluginSections',

		descriptionHeight: 0,

		recordEvent: function( eventAction ) {
			analytics.ga.recordEvent( 'Plugins', eventAction, 'Plugin Name', this.props.plugin.slug );
		},

		componentDidUpdate: function() {
			if ( this.refs.content ) {
				const node = this.refs.content;

				if ( node && node.offsetHeight ) {
					this.descriptionHeight = node.offsetHeight;
				}
			}
		},

		getFilteredSections: function() {
			if ( this.props.isWpcom ) {
				return this.getWpcomFilteredSections();
			}

			return [
				{
					key: 'description',
					title: this.props.translate( 'Description', {
						context: 'Navigation item',
						textOnly: true,
					} ),
				},
				{
					key: 'installation',
					title: this.props.translate( 'Installation', {
						context: 'Navigation item',
						textOnly: true,
					} ),
				},
				{
					key: 'changelog',
					title: this.props.translate( 'Changelog', {
						context: 'Navigation item',
						textOnly: true,
					} ),
				},
				{
					key: 'faq',
					title: this.props.translate( 'FAQs', {
						context: 'Navigation item',
						textOnly: true,
					} ),
				},
				{
					key: 'other_notes',
					title: this.props.translate( 'Other Notes', {
						context: 'Navigation item',
						textOnly: true,
					} ),
				},
			];
		},

		getWpcomFilteredSections: function() {
			return [
				{
					key: 'description',
					title: this.props.translate( 'Description', {
						context: 'Navigation item',
						textOnly: true,
					} ),
				},
			];
		},

		getInitialState: function() {
			return {
				selectedSection: false,
				readMore: false,
			};
		},

		getSelected: function() {
			return this.state.selectedSection || this.getDefaultSection();
		},

		getDefaultSection: function() {
			const sections = this.props.plugin.sections;
			return find( this.getFilteredSections(), function( section ) {
				return sections[ section.key ];
			} ).key;
		},

		getAvailableSections: function() {
			const sections = this.props.plugin.sections;
			return filter( this.getFilteredSections(), function( section ) {
				return sections[ section.key ];
			} );
		},

		getNavTitle: function( sectionKey ) {
			const titleSection = find( this.getFilteredSections(), function( section ) {
				return section.key === sectionKey;
			} );

			return titleSection && titleSection.title ? titleSection.title : titleCase( sectionKey );
		},

		setSelectedSection: function( section, event ) {
			this.setState( {
				readMore: false !== this.state.readMore || this.getSelected() !== section,
				selectedSection: section,
			} );
			if ( event ) {
				this.recordEvent( 'Clicked Section Tab: ' + section );
			}
		},

		toggleReadMore: function() {
			this.setState( { readMore: ! this.state.readMore } );
		},

		renderReadMore: function() {
			if ( this.props.isWpcom || this.descriptionHeight < this._COLLAPSED_DESCRIPTION_HEIGHT ) {
				return null;
			}
			const button = (
				<button className="plugin-sections__read-more-link" onClick={ this.toggleReadMore }>
					<span className="plugin-sections__read-more-text">
						{ this.props.translate( 'Read More' ) }
					</span>
				</button>
			);
			return (
				<div className="plugin-sections__read-more">
					{ // We remove the link but leave the plugin-sections__read-more container
					// in order to minimize jump on small sections.
					this.state.readMore ? null : button }
				</div>
			);
		},

		render: function() {
			const contentClasses = classNames( 'plugin-sections__content', {
				trimmed: ! this.props.isWpcom && ! this.state.readMore,
			} );

			// Defensively check if this plugin has sections. If not, don't render anything.
			if ( ! this.props.plugin || ! this.props.plugin.sections || ! this.getAvailableSections() ) {
				return null;
			}

			/*eslint-disable react/no-danger*/
			return (
				<div className="plugin-sections">
					<div className="plugin-sections__header">
						<SectionNav selectedText={ this.getNavTitle( this.getSelected() ) }>
							<NavTabs>
								{ this.getAvailableSections().map( function( section ) {
									return (
										<NavItem
											key={ section.key }
											onClick={ this.setSelectedSection.bind( this, section.key ) }
											selected={ this.getSelected() === section.key }
										>
											{ section.title }
										</NavItem>
									);
								}, this ) }
							</NavTabs>
						</SectionNav>
					</div>
					<Card>
						<div
							ref="content"
							className={ contentClasses }
							// Sanitized in client/lib/plugins/utils.js with sanitizeHtml
							dangerouslySetInnerHTML={ {
								__html: this.props.plugin.sections[ this.getSelected() ],
							} }
						/>
						{ this.renderReadMore() }
					</Card>
				</div>
			);
			/*eslint-enable react/no-danger*/
		},
	} )
);
