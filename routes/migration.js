const Joi = require('joi');
const Boom = require('boom');

// register migration scripts here in order of version, 
// i.e. list the smalles version first
const migrationScripts = [
]

module.exports = {
  method: 'POST',
  path:'/migration',
  options: {
    validate: {
      payload: {
        item: Joi.object().required()
      }
    }
  },
  handler: (request, h) => {
    let item = request.payload.item;
    const results = migrationScripts.map(script => {
      const result = script.migrate(item);
      if (result.isChanged) {
        item = result.item;
      }
      return result;
    })
    const isChanged = results.findIndex(result => {
      return result.isChanged;
    });
    if (isChanged >= 0) {
      return {
        item: item
      }
    }
    return Boom.create(304, 'item not modified');
  }
}
