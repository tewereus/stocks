export const base_url = "http://localhost:5000/api/v1";

const getTokenFromLocalStorage = localStorage.getItem("company")
  ? JSON.parse(localStorage.getItem("company"))
  : null;

export const config = {
  headers: {
    Authorization: `Bearer ${
      getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
    }`,
    Accept: "application/json",
  },
};
