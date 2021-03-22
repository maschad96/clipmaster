import database from './database';
import { clipboard, ipcRenderer } from 'electron';
import React, { ReactPropTypes } from 'react';
import { render } from 'react-dom';
import './index.css';

interface Clipping {
	content: string;
	id: number;
	key: number;
	onRemove: (x: number) => void;
}
interface IState {
	clippings?: Clipping[];
}

const writeToClipboard = (content: string) => {
	clipboard.writeText(content);
};
class Application extends React.Component<unknown, IState> {
	constructor(props: ReactPropTypes) {
		super(props);
		this.state = {
			clippings: [],
		};
		this.addClipping = this.addClipping.bind(this);
		this.fetchClippings = this.fetchClippings.bind(this);
		this.handleWriteToClipboard = this.handleWriteToClipboard.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		ipcRenderer.on('create-new-clipping', this.addClipping);
		ipcRenderer.on('write-recent-clipping', this.handleWriteToClipboard);
		this.fetchClippings();
	}

	fetchClippings() {
		database('clippings')
			.select()
			.then((clippings) => this.setState({ clippings }));
	}

	addClipping() {
		const content = clipboard.readText();

		database('clippings').insert({ content }).then(this.fetchClippings);
	}

	handleWriteToClipboard() {
		const clipping = this.state.clippings[0];
		if (clipping) writeToClipboard(clipping.content);
	}

	handleRemove(id: number): void {
		database('clippings')
			.where('id', id)
			.delete()
			.then(this.fetchClippings);
	}

	render() {
		return (
			<div className="container">
				<header className="controls">
					<button id="copy-from-clipboard" onClick={this.addClipping}>
						Copy From Clipboard
					</button>
				</header>

				<section className="content">
					<div className="clippings-list">
						{this.state.clippings.map(
							({ content, key, id }: Clipping) => (
								<Clipping
									content={content}
									key={key}
									id={id}
									onRemove={() => this.handleRemove(id)}
								/>
							)
						)}
					</div>
				</section>
			</div>
		);
	}
}

const Clipping = ({ content, id, key, onRemove }: Clipping) => {
	const remove = () => {
		onRemove(id);
	};
	return (
		<article className="clippings-list-item" key={key}>
			<div className="clipping-text" data-disabled="true">
				{content}
			</div>
			<div className="clipping-controls">
				<button onClick={() => writeToClipboard(content)}>
					&rarr; Clipboard
				</button>
				<button>Update</button>
				<button className="remove-clipping" onClick={remove}>
					Remove
				</button>
			</div>
		</article>
	);
};

render(<Application />, document.getElementById('application'));
