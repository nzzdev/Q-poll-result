const fs = require('fs');
const Enjoi = require('enjoi');
const Joi = require('joi');
const resourcesDir = __dirname + '/../../resources/';
const viewsDir = __dirname + '/../../views/';

const styleHashMap = require(__dirname + `/../../styles/hashMap.json`);

const pollTypeInfos = require(resourcesDir + '/helpers/pollTypeInfos.js');
const schemaString = JSON.parse(fs.readFileSync(resourcesDir + 'schema.json', {
	encoding: 'utf-8'
}));

const schema = Enjoi(schemaString);

require('svelte/ssr/register');
const staticTemplate = require(viewsDir + 'HtmlStatic.html');

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
		cache: false, // do not send cache control header to let it be added by Q Server
    cors: true
	},
	handler: function(request, reply) {
    let renderingData = {
      item: request.payload.item,
      pollTypeInfos: pollTypeInfos
    }
    
		let data = {
			stylesheets: [
				{
					name: styleHashMap.default
				}
			], 
			markup: staticTemplate.render(renderingData)
		}
		return reply(data);
	}
}
