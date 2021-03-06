/** @format */
module.exports = [
	{
		active: true,
		author: 'Automattic',
		author_url: 'http://automattic.com/wordpress-plugins/',
		autoupdate: false,
		description:
			"Used by millions, Akismet is quite possibly the best way in the world to <strong>protect your blog from comment and trackback spam</strong>. It keeps your site protected from spam even while you sleep. To get started: 1) Click the 'Activate' link to the left of this description, 2) <a href='http://akismet.com/get/'>Sign up for an Akismet API key</a>, and 3) Go to your Akismet configuration page, and save your API key.",
		id: 'akismet/akismet',
		name: 'Akismet',
		network: false,
		plugin_url: 'http://akismet.com/',
		slug: 'akismet',
		version: '3.1.1',
	},
	{
		active: false,
		author: 'Automattic',
		author_url: 'http://automattic.com',
		autoupdate: false,
		description: 'The first stop for every WordPress developer',
		id: 'developer/developer',
		name: 'Developer',
		network: false,
		plugin_url: 'http://wordpress.org/extend/plugins/developer/',
		slug: 'developer',
		version: '1.2.5',
	},
	{
		active: false,
		author: 'Matt Mullenweg',
		author_url: 'http://ma.tt/',
		autoupdate: false,
		description:
			'This is not just a plugin, it symbolizes the hope and enthusiasm of an entire generation summed up in two words sung most famously by Louis Armstrong: Hello, Dolly. When activated you will randomly see a lyric from <cite>Hello, Dolly</cite> in the upper right of your admin screen on every page.',
		id: 'hello-dolly/hello',
		name: 'Hello Dolly',
		network: false,
		plugin_url: 'http://wordpress.org/extend/plugins/hello-dolly/',
		slug: 'hello-dolly',
		update: {
			id: '3564',
			new_version: '1.6',
			package: 'https://downloads.wordpress.org/plugin/hello-dolly.1.6.zip',
			plugin: 'hello-dolly/hello.php',
			slug: 'hello-dolly',
			url: 'https://wordpress.org/plugins/hello-dolly/',
		},
		version: '1.1',
	},
	{
		active: false,
		author: 'Automattic',
		author_url: 'http://automattic.com/',
		autoupdate: false,
		description: 'Very fast caching plugin for WordPress.',
		id: 'wp-super-cache/wp-cache',
		name: 'WP Super Cache',
		network: true,
		plugin_url: 'http://wordpress.org/plugins/wp-super-cache/',
		slug: 'wp-super-cache',
		version: '1.4.6',
	},
];
