import React from 'react';
import { render } from 'react-dom';
import './index.css';

class Application extends React.Component {
	render() {
		return (
			<div className="container">
				<header className="controls">
					<button id="copy-from-clipboard">
						Copy From Clipboard
					</button>
				</header>

				<section className="content">
					<div className="clippings-list"></div>
				</section>
			</div>
		);
	}
}

render(<Application />, document.getElementById('application'));

console.log(
	'👋 This message is being logged by "renderer.js", included via webpack'
);
