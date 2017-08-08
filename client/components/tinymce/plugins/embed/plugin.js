/**
 * External dependencies
 *
 * @format
 */

import React from 'react';
import ReactDom from 'react-dom';
import tinymce from 'tinymce/tinymce';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import EmbedDialog from './dialog';
import { getSelectedSiteId } from 'state/ui/selectors';

/**
 * Manages an EmbedDialog to allow editing the URL of an embed inside the editor.
 *
 * @param {object} editor An instance of TinyMCE
 */
const embed = editor => {
	let embedDialogContainer;

	/**
	 * Open or close the EmbedDialog
	 *
	 * @param {boolean} visible `true` makes the dialog visible; `false` hides it.
	 */
	const render = ( visible = true ) => {
		console.log( 'plugin this', this );

		const selectedEmbedNode = editor.selection.getNode();
		const embedDialogProps = {
			embedUrl: selectedEmbedNode.innerText || selectedEmbedNode.textContent,
			isVisible: visible,
			//siteId: siteId,  // todo use state selector probably, but check what other tinymce plugins use first
			siteId: 5089392,
			onCancel: () => render( false ),
			onUpdate: newUrl => {
				editor.execCommand( 'mceInsertContent', false, newUrl );
				render( false );
			},
		};

		ReactDom.render( React.createElement( EmbedDialog, embedDialogProps ), embedDialogContainer );

		// Focus on the editor when closing the dialog, so that the user can start typing right away
		// instead of having to tab back to the editor.
		if ( ! visible ) {
			editor.focus();
			// todo maybe this is why newurl gets inserted back at start of editor instead of right place? probably not, but test
		}
	};

	editor.addCommand( 'embedDialog', () => render() );

	editor.on( 'init', () => {
//		console.log('init', this.siteId );
		embedDialogContainer = editor.getContainer().appendChild(
			document.createElement( 'div' )
		);
	} );

	editor.on( 'remove', () => {
		ReactDom.unmountComponentAtNode( embedDialogContainer );
		embedDialogContainer.parentNode.removeChild( embedDialogContainer );
		embedDialogContainer = null;
	} );
};

//// huh, there's really no <Provider> wrapping this? that doesn't seem right
//const connectedEmbed = connect( ( state, { siteId } ) => {  // why has siteId in param?
//	if ( ! siteId ) {
//		//siteId = getSelectedSiteId( state );    // don't do this conditional, just always grab it?
//		siteId = 5089392;
//	} else console.log( 'where is this coming from?', siteId );
//
//	// this can be cleaned up a lot once it's working
//
//	return { siteId };
//} )( embed );

//const connectedEmbed = connect( state => {
//	return {
//		siteId: 5089392,
//	};
//} )( embed );
// maybe problem is that embed isn't a react component, it's just a native js class?
// maybe this really should be moved to the component

export default () => {
	//tinymce.PluginManager.add( 'embed', connectedEmbed );
	tinymce.PluginManager.add( 'embed', embed );
};
