const { EventType, eventModule } = require('@sern/handler');          

export default eventModule({
    type: EventType.Sern,
    name : 'error',
    execute(err) {
      console.log(err);
    }
  })