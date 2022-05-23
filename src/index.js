import Fastify from 'fastify';

import { users } from './users';

const fastify = Fastify({
  logger: true,
});
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

fastify.post("/uppercase", (request, reply) =>{
  let result = request.body;
  if(result.match(/fuck/gi)) return reply.status(403).send("unresolved");
  return reply.send(result.toUpperCase());
})

fastify.post("/lowercase", (request, reply) =>{
  let result = request.body;
  if(result.match(/fuck/gi)) return reply.status(403).send("unresolved");
  return reply.send(result.toLowerCase());
})

fastify.get('/user/:id', (request, reply) => {
  const id = request.params.id;
  users[id] ? reply.send(users[id]) : reply.status(400).send('User not exist');
});

fastify.get("/users", (request, reply) =>{
  const { filter, value } = request.query;
  const arrayWithoutId = Object.values(users); // list without id

  const useFilter = arrayWithoutId.filter((item) => String(item[filter]) === String(value));
  // if there are no matches, we return the entire list
  filter && value ? reply.send(useFilter) : reply.send(arrayWithoutId);
})

export default fastify;

