import Event from '@ioc:Adonis/Core/Event'

Event.on('db:query', function ({ sql, bindings }) {
  console.log(sql, bindings)
})
