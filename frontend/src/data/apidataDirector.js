
import { DealGET, DealPOST, addMovieSession, addPredecessor, getAudiences, getAvailableTheatres, getDirectorMovies, updateMovieName } from "../APIFunctions/DealApi";


const apidataDirector = {
  "View-Available-Theatres": {
    name: "View Available Theatres",
    getWithPostFunction: getAvailableTheatres,
    dataTitle: "Theatres",
    form: {
      buttonText: "View Available Theatres",
      inputs: [
        {
          type: "text",
          name: "time_slot",
          label: "Time Slot"
        },
        {
          type: "text",
          name: "date",
          label: "Date"
        }

      ]
    }
  },

  "Add-Movies": {
    name: "Add Movies",
    postFunction: addMovieSession,
    form: {
      buttonText: "Add Movie",
      inputs: [
        {
          type: "number",
          name: "movie_id",
          label: "Movie ID"
        },
        {
          type: "text",
          name: "movie_name",
          label: "Movie Name (if movie with Movie ID exists, leave blank this field)"
        },
        {
          type: "number",
          name: "theatre_id",
          label: "Theatre Id"
        },
        {
          type: "number",
          name: "time_slot",
          label: "Time Slot"
        },
        {
          type: "number",
          name: "duration",
          label: "Duration (if movie with Movie ID exists, leave blank this field)"
        },
        {
          type: "text",
          name: "date",
          label: "Date"
        },
        {
          type: "number",
          name: "session_id",
          label: "Session Id"
        },
        {
          type: "text",
          name: "genres",
          label: "Please Write genre ids with putting comma between (if movie with Movie ID exists, leave blank this field)"
        }

      ]
    }
  },
  "Add-Predecessors": {
    name: "Add Predecessors",
    postFunction: addPredecessor,
    form: {
      buttonText: "Add Predecessor",
      inputs: [
        {
          type: "number",
          name: "predecessor_movie_id",
          label: "Predecessor Movie ID"
        },
        {
          type: "number",
          name: "ancestor_movie_id",
          label: "Ancestor Movie ID"
        },

      ]
    }
  },
  "View-Director's-Movies": {
    name: "View Director's Movies",
    dataTitle: "Movies",
    getFunction: getDirectorMovies,

  },
  "View-Audiences": {
    name: "View Audiences",
    getWithPostFunction: getAudiences,
    dataTitle: "Audiences",
    form: {
      buttonText: "Get Audiences",
      inputs: [
        {
          type: "number",
          name: "movie_id",
          label: "Movie ID"
        }

      ]
    }
  },
  "Update-Movie-Name": {
    name: "Update Movie Name",
    postFunction: updateMovieName,
    form: {
      buttonText: "Update Movie Name",
      inputs: [
        {
          type: "number",
          name: "movie_id",
          label: "Movie ID"
        },
        {
          type: "text",
          name: "movie_name",
          label: "Movie Name"
        },

      ]
    }
  },

}

export default apidataDirector;