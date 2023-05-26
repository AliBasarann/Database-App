
import { DealGET, DealPOST } from "../APIFunctions/DealApi";


const apidataDirector = {
  "View-Available-Theatres": {
    name: "View Available Theatres",
    postFunction: DealPOST,
    getFunction: DealGET,
    dataTitle: "Theatres",
    form: {
      buttonText: "View Available Theatres",
      inputs: [
        {
          type: "text",
          name: "timeSlot",
          label: "Time Slot"
        }

      ]
    }
  },

  "Add-Movies": {
    name: "Add Movies",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Add Movie",
      inputs: [
        {
          type: "number",
          name: "movieId",
          label: "Movie ID"
        },
        {
          type: "text",
          name: "movieName",
          label: "Movie Name"
        },
        {
          type: "number",
          name: "theatreId",
          label: "Theatre Id"
        },
        {
          type: "number",
          name: "timeSlot",
          label: "Time Slot"
        }

      ]
    }
  },
  "Add-Predecessors": {
    name: "Add Predecessors",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Add Predecessor",
      inputs: [
        {
          type: "number",
          name: "predecessorMovieId",
          label: "Predecessor Movie ID"
        },
        {
          type: "number",
          name: "ancestorMovieId",
          label: "Ancestor Movie ID"
        },

      ]
    }
  },
  "View-Director's-Movies": {
    name: "View Director's Movies",
    dataTitle: "Movies",
    postFunction: DealPOST,
    getFunction: DealGET,

  },
  "View-Audiences": {
    name: "View Audiences",
    postFunction: DealPOST,
    getFunction: DealGET,
    dataTitle: "Audiences",
    form: {
      buttonText: "Get Audiences",
      inputs: [
        {
          type: "number",
          name: "movieId",
          label: "Movie ID"
        }

      ]
    }
  },
  "Update-Movie-Name": {
    name: "Update Movie Name",
    postFunction: DealPOST,
    getFunction: DealGET,
    form: {
      buttonText: "Update Movie Name",
      inputs: [
        {
          type: "number",
          name: "movieId",
          label: "Movie ID"
        },
        {
          type: "text",
          name: "movieName",
          label: "Movie Name"
        },

      ]
    }
  },

}

export default apidataDirector;