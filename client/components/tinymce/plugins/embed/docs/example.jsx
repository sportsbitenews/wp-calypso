/**
 * External dependencies
 *
 * @format
 */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import EmbedDialog from '../dialog';
import { getSelectedSiteId } from 'state/ui/selectors';

// maybe this needs to be hooked up to redux so that embedviewmanager.store will be populated?
	// would that be bad, b/c example shouldn't need to be hooked up? well, actually, i think it probably should

class EmbedDialogExample extends PureComponent {
	static propTypes = {
		//siteId: PropTypes.number.isRequired,
	};

	state = {
		embedUrl: 'https://www.youtube.com/watch?v=R54QEvTyqO4',
		showDialog: false,
	};

	//constructor( props ) {
	//	super(props);
	//	console.log('props:',props);
	//}

	openDialog = () => this.setState( { showDialog: true } );

	onCancel = () => {
		this.setState( { showDialog: false } );
	};

	onUpdate = newUrl => {
		this.setState( {
			embedUrl: newUrl,
			showDialog: false,
		} );
	};

	render() {
		return (
			<Card>
				<Button onClick={ this.openDialog }>Open Embed Dialog</Button>

				<EmbedDialog
					embedUrl={ this.state.embedUrl }
					isVisible={ this.state.showDialog }
					siteId={ 5089392 }
					onCancel={ this.onCancel }
					onUpdate={ this.onUpdate }
				/>
			</Card>
		);
	}
}

//const ConnectedEmbedDialogExample = connect( state => ( {
//	siteId: 5089392 //getSelectedSiteId( state ),
//	// clean up return syntax etc once working
//} ) )( EmbedDialogExample );
//
//ConnectedEmbedDialogExample.displayName = 'EmbedDialogExample';
////todo display necessary? clean up etc
//export default ConnectedEmbedDialogExample;

export default EmbedDialogExample;
