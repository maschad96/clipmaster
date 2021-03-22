import path from 'path';
import { remote } from 'electron';
import { Knex, knex } from 'knex';
import 'sqlite3';

const { app } = remote;
const userData = app.getPath('userData');

const config: Knex.Config = {
	client: 'sqlite3',
	connection: {
		filename: path.join(userData, 'clipmaster-clippings.sqlite'),
	},
	useNullAsDefault: true,
};
const database = knex(config);

database.schema.hasTable('clippings').then((exists) => {
	if (!exists) {
		return database.schema.createTable('clippings', (table) => {
			console.log('table being created');
			table.increments('id').primary();
			table.text('content');
		});
	}
});

export default database;
