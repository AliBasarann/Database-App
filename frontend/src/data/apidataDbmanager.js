
import { DealGET, DealPOST } from "../APIFunctions/DealApi";


const apidata = {
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
  "Drop-Tables": {
    name: "Drop Table",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Drop Table",
      inputs: [
        {
          type: "text",
          name: "tableName",
          label: "Table Name"
        }

      ]
    }
  },
  "Add-Director": {
    name: "Add Director",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Add Director",
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
        },
        {
          type: "text",
          name: "nation ",
          label: "Nation"
        },

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
  },
  "Delete-User": {
    name: "Delete User",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Delete User",
      inputs: [
        {
          type: "text",
          name: "username",
          label: "Please provide a valid Username"
        },
      ]
    }
  },
  "Update-Platform-Id": {
    name: "Update Platform Id",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Update Platform Id",
      inputs: [
        {
          type: "text",
          name: "username",
          label: "Please provide a valid Username"
        },    
        
        {
          type: "number",
          name: "platformId",
          label: "Please provide a valid Platform Id"
        },

      ]
    }
  },
  "View-Directors": {
    name: "View Directors",
    dataTitle: "Directors",
    postFunction: DealPOST,
    getFunction: DealGET,

  },
  "View-Ratings": {
    name: "View Ratings",
    dataTitle: "Ratings",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Get Ratings",
      inputs: [
        {
          type: "text",
          name: "username",
          label: "Please provide a valid Username"
        }
      ]
    }
  },
  "View-Movies": {
    name: "View Movies",
    dataTitle: "Movies",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Get Movies",
      inputs: [
        {
          type: "text",
          name: "username",
          label: "Please provide a valid Username"
        }
      ]
    }
  },
  "View-Movie-Ratings": {
    name: "View Movie Ratings",
    dataTitle: "Ratings",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Get Ratings",
      inputs: [
        {
          type: "text",
          name: "movieId",
          label: "Please provide a valid Movie Id"
        }
      ]
    }
  }
}


export default apidata;
