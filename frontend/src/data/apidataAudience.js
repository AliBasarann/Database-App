
import { DealGET, DealPOST, buyTicket, getTickets, rateMovie, subscribePlatform } from "../APIFunctions/DealApi";


const apidataAudience = {
  "Buy-Tickets": {
    name: "Buy Tickets",
    postFunction: buyTicket,
    form: {
      buttonText: "Buy Ticket",
      inputs: [
        {
          type: "number",
          name: "session_id",
          label: "Session ID"
        }

      ]
    }
  },
  "View-Tickets": {
    name: "View Tickets",
    dataTitle: "Tickets",
    getFunction: getTickets,

  },
  "Rate-Movies": {
    name: "Rate Movies",
    postFunction: rateMovie,
    form: {
      buttonText: "Rate",
      inputs: [
        {
          type: "number",
          name: "movie_id",
          label: "Movie ID"
        },
        {
          type: "number",
          name: "rating",
          label: "Rate"
        }

      ]
    }
  },
  "Subscribe-Platform": {
    name: "Subscribe Platform",
    postFunction: subscribePlatform,
    form: {
      buttonText: "Subscribe",
      inputs: [
        {
          type: "number",
          name: "platform_id",
          label: "Platform ID"
        }
      ]
    }
  }

}

export default apidataAudience;