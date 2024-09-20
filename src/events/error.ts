import { EventType, eventModule } from "@sern/handler";

export default eventModule({
    type: EventType.Sern,
    name : 'error',
    execute(err) {
      console.log(err);
    }
})