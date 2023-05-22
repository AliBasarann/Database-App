
import { DealGET, DealPOST } from "../APIFunctions/DealApi";


const apidataAudience = {
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
  },
  "Add-Audience": {
    name: "Add Audience",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Add Audience",
      inputs: [
        {
          type: "text",
          name: "username",
          label: "Username"
        },
        {
          type: "text",
          name: "name",
          label: "Name"
        },
        {
          type: "text",
          name: "surname",
          label: "Surname"
        },
        {
          type: "text",
          name: "password ",
          label: "Password"
        }

      ]
    }
  }

}

export default apidataAudience;