import { getAPIUrl, getUserEmail } from "../Utilities/utilityfunctions";
import axios from "axios"


export async function DealPOST(body) {

    try {
        body.userEmail = getUserEmail();
        const response = await axios.post(getAPIUrl()+"/games/deal", body);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

export async function DealGET() {
    const response = await axios.get(getAPIUrl()+"/games/deneme", {params: {userEmail: getUserEmail()}});
    return await response.data;
}

export async function loginManager(body) {
    console.log(getAPIUrl());
    const response = await axios.post(getAPIUrl() + "/manager/login", body);
    console.log(response);
    return response;
}

export async function loginAudience(body) {
    console.log(getAPIUrl());
    const response = await axios.post(getAPIUrl() + "/audience/login", body);
    console.log(response);
    return response;
}

export async function loginDirector(body) {
    console.log(getAPIUrl());
    const response = await axios.post(getAPIUrl() + "/director/login", body);
    console.log(response);
    return response;
}

export async function addDirector(body) {
    const response = await axios.post(getAPIUrl() + "/manager/directors", body, {headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response;
}

export async function addAudience(body) {
    body.ratingPlatforms = body.ratingPlatforms.split(",");
    const response = await axios.post(getAPIUrl() + "/manager/audiences", body, {headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response;
}

export async function deleteAudience(body) {
    const response = await axios.delete(getAPIUrl() + `/manager/audiences?username=${body.username}`, {headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response;
}

export async function updatePlatformId(body) {
    const response = await axios.put(getAPIUrl() + `/manager/directors?username=${body.username}&platform_id=${body.platform_id}`,{}, {headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response;
}

export async function getDirectors() {
    const response = await axios.get(getAPIUrl() + `/manager/directors`,{headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response.data;
}

export async function getRatings(body) {
    const response = await axios.get(getAPIUrl() + `/manager/audiences/ratings?username=${body.username}`,{headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response.data;
}

export async function getMoviesByDirector(body) {
    const response = await axios.get(getAPIUrl() + `/manager/directors/movies?username=${body.username}`,{headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response.data;
}

export async function getMovieRating(body) {
    const response = await axios.get(getAPIUrl() + `/manager/movies?movie_id=${body.movie_id}`,{headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response.data;
}

export async function buyTicket(body) {
    const response = await axios.post(getAPIUrl() + `/audience/ticket?session_id=${body.session_id}`, {}, {headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response;
}

export async function getTickets() {
    const response = await axios.get(getAPIUrl() + `/audience/ticket`,{headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response.data;
}

export async function rateMovie(body) {
    const response = await axios.post(getAPIUrl() + `/audience/rating?movie_id=${body.movie_id}&rating=${body.rating}`, {}, {headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response;
}
export async function getAvailableTheatres(body) {
    const response = await axios.get(getAPIUrl() + `/director/theatres?date=${body.date}&time_slot=${body.time_slot}`,{headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response.data;
}

export async function addMovieSession(body) {
    body.time_slot = +body.time_slot;
    body.duration = +body.duration;
    const response = await axios.post(getAPIUrl() + `/director/movies`, body, {headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response;
}

export async function addPredecessor(body) {
    const response = await axios.post(getAPIUrl() + `/director/precedes`, body, {headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response;
}

export async function getDirectorMovies() {
    const response = await axios.get(getAPIUrl() + `/director/movies`,{headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response.data;
}

export async function getAudiences(body) {
    const response = await axios.get(getAPIUrl() + `/director/audiences?movie_id=${body.movie_id}`,{headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response.data;
}

export async function updateMovieName(body) {
    const response = await axios.put(getAPIUrl() + `/director/movie`,body, {headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response;
}

export async function subscribePlatform(body) {
    const response = await axios.post(getAPIUrl() + `/audience/platform`, body, {headers: {Authorization: localStorage.getItem("accessToken")}});
    console.log(response);
    return response;
}