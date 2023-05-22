import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  matchPath,
  redirect,
  RouterProvider,
} from "react-router-dom";
import MainContainer from './Containers/MainContainer/MainContainer';
import Test from './Pages/Test/Test';
import FormBuilder from './Components/FormBuilder/FormBuilder';
import APIPage from './Pages/APIPage/APIPage';
import apidata from './data/apidataDbmanager';
import apidataDirector from './data/apidataDirector';
import apidataAudience from './data/apidataAudience';
import LoginPage from './Pages/LoginPage/LoginPage';
import LoginPageDirector from './Pages/LoginPage/LoginPageDirector';
import LoginPageAudience from './Pages/LoginPage/LoginPageAudience';
import NavBar from './Components/NavBar/NavBar';



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainContainer />,
    loader: ({ request }) => {
      if (new URL(request.url).pathname == "/") {
        return redirect("/api")
      } else {
        return null

      }
    },
    children: [
      {
        path: "test",
        element: <Test />
      },
      {
        path: "api/db-manager",
        loader: () => redirect(`/api/db-manager/${Object.keys(apidata)[0]}`)
      }
      ,
      {
        path: "api/db-manager/:name",

        loader: async ({ params }) => {
          const email = await localStorage.getItem("email");
          const password = await localStorage.getItem("password");
          if (!email || !password) {
            return redirect("/login");
          } else {
            return apidata[params.name]

          }
        }
        ,
        element: <APIPage />
      },
      {
        path: "api/audience",
        loader: () => redirect(`/api/audience/${Object.keys(apidataAudience)[0]}`)
      }
      ,
      {
        path: "api/audience/:name",

        loader: async ({ params }) => {
          const email = await localStorage.getItem("email");
          const password = await localStorage.getItem("password");
          if (!email || !password) {
            return redirect("/login");
          } else {
            return apidataAudience[params.name]

          }
        }
        ,
        element: <APIPage />
      },
      {
        path: "api/director",
        loader: () => redirect(`/api/director/${Object.keys(apidataDirector)[0]}`)
      }
      ,
      {
        path: "api/director/:name",

        loader: async ({ params }) => {
          const email = await localStorage.getItem("email");
          const password = await localStorage.getItem("password");
          if (!email || !password) {
            return redirect("/login");
          } else {
            return apidataDirector[params.name]

          }
        }
        ,
        element: <APIPage />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "NavBar",
        element: <NavBar />
      },
      {
        path: "director-login",
        element: <LoginPageDirector />
      },
      {
        path: "audience-login",
        element: <LoginPageAudience />
      },
    ]
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
