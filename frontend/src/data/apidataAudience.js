
import { DealGET, DealPOST } from "../APIFunctions/DealApi";


const apidataAudience = {
  "Buy-Tickets": {
    name: "Buy Tickets",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Buy Ticket",
      inputs: [
        {
          type: "number",
          name: "sessionId",
          label: "Session ID"
        }

      ]
    }
  },
  "View-Tickets": {
    name: "View Tickets",
    dataTitle: "Tickets",
    postFunction: DealPOST,
    getFunction: DealGET,

  },
  "Rate-Sessions": {
    name: "Rate Sessions",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Rate",
      inputs: [
        {
          type: "number",
          name: "sessionId",
          label: "Session ID"
        },
        {
          type: "number",
          name: "rate",
          label: "Rate"
        }

      ]
    }
  },

}

export default apidataAudience;