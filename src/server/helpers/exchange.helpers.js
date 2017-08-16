// for setting new sub-schema to parent schema
module.exports.setSubSchemaData = function setSubSchemaData(body, prop, type){
  for (let i = body.length - 1; i >= 0; i--) {
    prop.push(createSchema[type](body[i]));
  }
}
// set exchange sub prop
module.exports.setUpdateSchema = function setUpdateSchema(exchangeProp, body){
  for (let i = 0; i < exchangeProp.length; i++) {
    for (let j = 0; j < body.length; j++) {
      if(exchangeProp[i]._id.toString() === body[j]._id){
        exchangeProp.set(i, body[j])
      }
    }
  }
}