
import { DealGET, DealPOST, addAudience, addDirector, deleteAudience, getDirectors, getMovieRating, getMoviesByDirector, getRatings, updatePlatformId } from "../APIFunctions/DealApi";


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
    postFunction: addDirector,
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
          type: "password",
          name: "password ",
          label: "Password"
        },
        {
          type: "text",
          name: "platform_id",
          label: "Rating Platform"
        },
        {
          type: "text",
          name: "nation",
          label: "Nation"
        },

      ]
    }
  },
  "Add-Audience": {
    name: "Add Audience",
    postFunction: addAudience,
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
          type: "password",
          name: "password ",
          label: "Password"
        },
        {
          type: "text",
          name: "ratingPlatforms",
          label: "Please Write Platforms with putting comma between"
        }

      ]
    }
  },
  "Delete-User": {
    name: "Delete User",
    postFunction: deleteAudience,
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
    postFunction: updatePlatformId,
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
          name: "platform_id",
          label: "Please provide a valid Platform Id"
        },

      ]
    }
  },
  "View-Directors": {
    name: "View Directors",
    dataTitle: "Directors",
    getFunction: getDirectors,

  },
  "View-Ratings": {
    name: "View Ratings",
    dataTitle: "Ratings",
    getWithPostFunction: getRatings,
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
    getWithPostFunction: getMoviesByDirector,
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
    name: "Get Average Rating",
    dataTitle: "Ratings",
    getWithPostFunction: getMovieRating,
    form: {
      buttonText: "Get Average Rating",
      inputs: [
        {
          type: "text",
          name: "movie_id",
          label: "Please provide a valid Movie Id"
        }
      ]
    }
  }
}


export default apidata;
