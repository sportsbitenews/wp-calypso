/**
 * External dependencies
 *
 * @format
 */

import PropTypes from 'prop-types';
import React from 'react';
import { debounce } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Dialog from 'components/dialog';
import EmbedViewManager from 'components/tinymce/plugins/wpcom-view/views/embed'
import FormTextInput from 'components/forms/form-text-input';

// embedviewmanager should go in plugin.js, not here? well, no, would want it to work in example
// rendering the editor screen and embeds and previews of embeds is real slow now. is that because of something you did, or just normal crap that'll go away with a distclean?

/*
 * Shows the URL of am embed and allows it to be edited.
 */
export class EmbedDialog extends React.Component {
	static propTypes = {
		embedUrl: PropTypes.string,
		isVisible: PropTypes.bool,
		siteId: PropTypes.number,   // make this required, since it wont work w/out it? if so, remove the default prop

		// Event handlers
		onCancel: PropTypes.func.isRequired,
		onUpdate: PropTypes.func.isRequired,

		// Inherited
		translate: PropTypes.func.isRequired,
	};

	static defaultProps = {
		embedUrl: '',
		isVisible: false,
		siteId: 0,
	};

	state = {
		embedUrl: this.props.embedUrl,
		// new one here for the preview? would be nicer to do without, but that might not be the react way, since re-renders triggers by state changes. that's what marek recommended
	};

	constructor( props ) {
		super( ...arguments );  // should pass props instead?

		console.log( 'embedialog props',props );

		this.embedViewManager = new EmbedViewManager();
		console.log('---------------------------before');
		// try fetching caret position before and after this. keep in mind it may be async
		this.embedViewManager.updateSite( this.props.siteId );
		console.log('---------------------------after');
		this.embedView = this.embedViewManager.getComponent();
	}

	componentWillMount() {
		this.debouncedUpdateEmbedPreview = debounce( function() {
			console.log('debounced call');
			this.embedViewManager.fetchEmbed( this.state.embedUrl );


			//document.getElementsByClassName('embed-dialog__url')[0].focus(); // todo hack to avoid focus stealiing
				// if keep, need to mock document in unit tests

			// show an error in the preview box if fetching the embed failed / it's an invalid URL
				// don't wanna do if they're still typing though. debounce might be enough to fix that, but still could be annoying.
				// need to play with
		}, 500 );

		// this doesn't need to be inside compwillmount? can just be regular function below?
	}

	/**
	 * Reset `state.embedUrl` whenever the component's dialog is opened or closed.
	 *
	 * If this were not done, then switching back and forth between multiple embeds would result in
	 * `state.embedUrl` being incorrect. For example, when the second embed was opened,
	 * `state.embedUrl` would equal the value of the first embed, since it initially set the
	 * state.
	 *
	 * @param {object} nextProps The properties that will be received.
	 */
	componentWillReceiveProps = nextProps => {
		this.setState( {
			embedUrl: nextProps.embedUrl,
		} );
	};

	onChangeEmbedUrl = event => {
		this.setState( { embedUrl: event.target.value } );
		this.debouncedUpdateEmbedPreview();

		// the debounce works, but the focus is jumping back to the start of the editor, probably related to the onInsert problem.
		// maybe it's because the embedview inside the editor is also refreshing? how to stop that to test if that fixes problem?

		event.target.focus();
			//todo hack to avoid focus stealiing
			// this might have performance issues, but probably not if this entire function is debounced?
				// see https://github.com/Automattic/wp-calypso/pull/17152#discussion_r142263113
	};

	onUpdate = () => {
		this.props.onUpdate( this.state.embedUrl );
	};

	onKeyDownEmbedUrl = event => {
		if ( 'Enter' !== event.key ) {
			return;
		}

		event.preventDefault();
		this.onUpdate();
	};

	render() {
		const { translate } = this.props;
		const dialogButtons = [
			<Button onClick={ this.props.onCancel }>{ translate( 'Cancel' ) }</Button>,
			<Button primary onClick={ this.onUpdate }>
				{ translate( 'Update' ) }
			</Button>,
		];

		return (
			<Dialog
				autoFocus={ false }
				buttons={ dialogButtons }
				additionalClassNames="embed__modal"
				isVisible={ this.props.isVisible }
				onCancel={ this.props.onCancel }
				onClose={ this.props.onCancel }
			>
				<h3 className="embed__title">{ translate( 'Embed URL' ) }</h3>

				<FormTextInput
					autoFocus={ true }
					className="embed__url"
					defaultValue={ this.state.embedUrl }
					onChange={ this.onChangeEmbedUrl }
					onKeyDown={ this.onKeyDownEmbedUrl }
				/>

				<this.embedView content={ this.state.embedUrl } />
			</Dialog>
		);

		{/*
			exception thrown when change it twice in a row. - only in FF
				maybe related to needing to debounce?

			Warning: unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.
				wrapConsole/<
				app:///./client/components/webpack-build-monitor/index.jsx:174:3
				printWarning
				app:///./node_modules/fbjs/lib/warning.js:35:7
				warning
				app:///./node_modules/fbjs/lib/warning.js:59:7
				unmountComponentAtNode
				app:///./node_modules/react-dom/lib/ReactMount.js:443:15
				wpview/</<
		   >>>	app:///./client/components/tinymce/plugins/wpcom-view/plugin.js:287:5
				...

			do we have any non-video embeds? if so, test those too
			*/}
	}
}

export default localize( EmbedDialog );
