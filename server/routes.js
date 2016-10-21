export default function (server) {

  // We can use this method, since we have set the require in the index.js to
  // elasticsearch. So we can access the elasticsearch plugins safely here.
  let call = server.plugins.elasticsearch.callWithRequest;


  // Register a GET API at /api/elasticsearch_status/indices that returns
  // an array of all indices in the elasticsearch. The server is actually an
  // HAPI server and the complete documentation of the "route" method can be
  // found in the official documentation: http://hapijs.com/api#serverrouteoptions
  server.route({
    path: '/api/log_engine/indices',
    method: 'GET',
    // The handler method will be called with the request that was made to this
    // API and a reply method as 2nd parameter, that must be called with the
    // content, that should be returned to the client.
    handler(req, reply) {

      // The call method that we just got from elasticsearch has the following
      // syntax: the first parameter should be the request that actually came
      // from the client. The callWithRequest method will take care about
      // passing authentication data from kibana to elasticsearch or return
      // authorization requests, etc.
      // Second parameter to the function is the name of the javascript method
      // you would like to call, as you can find it here in the documentation:
      // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/
      // The third parameter will be passed as a parameter to the javascript method
      // (it should contain the data you would have also passed to the client directly).
      // The method returns a promise, which will be resolved with the data returned
      // from Elasticsearch.
      call(req, 'cluster.state').then(function (response) {
        // Return just the names of all indices to the client.
        reply(
          Object.keys(response.metadata.indices)
        );
      });
    }
  });

  server.route({
    path: '/api/log_engine/index/{name}',
    method: 'GET',
    handler(req, reply) {
      call(req, 'search', {
        index: req.params.name,
        q: '*'
      }).then(function (response) {
        reply(response.hits.hits);
      });
    }
  });

  server.route({
    path: '/api/log_engine/{index}/message/{id}',
    method: 'GET',
    handler(req, reply) {
      call(req, 'get', {
        index: req.params.index,
        type: 'message',
        id: req.params.id
      }).then(function(response){
        reply(response._source);
      });
    }
  });

  server.route({
    path: '/api/log_engine/querysearch/{index}/{query}',
    method: 'POST',
    handler(req, reply) {
      call(req, 'search', {
        index: req.params.index,
        query: 

          {
            "joined" : {
              "entity" : {
                "esquery" : {
                  "basequery" : req.params.query
                         
                }
              }
            }
          }

      }).then(function(response){
        reply(response._source);
      });
    }
  });

  server.route({
    path: '/api/log_engine/querysearch/{index}/{id}/{query}',
    method: 'POST',
    handler(req, reply) {
      console.log('req', req);
      call(req, 'update', {
        index: req.params.index,
        type: 'message',
        id: req.params.id,
        body: {
          doc: {
            query
          }
        }
      }).then(function(response){
        console.log('response', response.hits.hits);
        reply(response.hits.hits);
      });
    }
  });

};