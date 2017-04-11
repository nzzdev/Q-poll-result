const fs = require('fs');
const Enjoi = require('enjoi');
const Joi = require('joi');
const resourcesDir = __dirname + '/../../resources/';
const viewsDir = __dirname + '/../../views/';

const pollTypeInfos = require(resourcesDir + '/helpers/pollTypeInfos.js');
const schemaString = JSON.parse(fs.readFileSync(resourcesDir + 'schema.json', {
	encoding: 'utf-8'
}));

const schema = Enjoi(schemaString);

require('svelte/ssr/register');
const staticTemplate = require(viewsDir + 'html-static.html');

module.exports = {
	method: 'POST',
	path: '/rendering-info/html-static',
	config: {
		validate: {
      options: {
        allowUnknown: true
      },
			payload: {
				item: schema,
        toolRuntimeConfig: Joi.object()
			}
		},
    cors: true
	},
	handler: function(request, reply) {
    let item = request.payload.item;
    item.pollTypeInfos = pollTypeInfos;
		let data = {
			stylesheets: [
				{
					name: 'default'
				}
			], 
			markup: staticTemplate.render(item)
		}
		return reply(data);
	}
}
