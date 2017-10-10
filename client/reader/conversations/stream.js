/** @format */
/**
 * External Dependencies
 */
import React from 'react';

/**
 * Internal Dependencies
 */
import Stream from 'reader/stream';
import DocumentHead from 'components/data/document-head';
import ConversationsEmptyContent from 'blocks/conversations/empty';

export default function( props ) {
	const emptyContent = <ConversationsEmptyContent />;
	return (
		<Stream
			postsStore={ props.store }
			key="conversations"
			shouldCombineCards={ false }
			className="conversations__stream"
			followSource="conversations"
			useCompactCards={ true }
			trackScrollPage={ props.trackScrollPage }
			emptyContent={ emptyContent }
		>
			<DocumentHead title={ props.title } />
		</Stream>
	);
}
