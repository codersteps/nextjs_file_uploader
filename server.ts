import next from "next";
import express from "express";
import datadogTracer from "dd-trace";

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
	// const tracer = datadogTracer.init({ hostname: "172.17.0.1" });
	// const OpenTracingMiddleware = require('express-opentracing').default;
  const server = express()
	// server.use(OpenTracingMiddleware({ tracer }));

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
