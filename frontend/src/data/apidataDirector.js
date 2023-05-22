
import { DealGET, DealPOST } from "../APIFunctions/DealApi";


const apidataDirector = {
  "Create-Tables": {
    name: "Create Table",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Create Table",
      inputs: [
        {
          type: "text",
          name: "tableName",
          label: "Table Name"
        }

      ]
    }
  }
}

export default apidataDirector;