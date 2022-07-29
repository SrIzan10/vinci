const { EventType, eventModule } = require('@sern/handler');          


exports.default = eventModule({
    type: EventType.Sern,
    name : 'error',
    execute(err) {
      console.log(err);
    }
  })