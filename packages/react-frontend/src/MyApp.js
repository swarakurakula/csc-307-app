// src/MyApp.js
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(row_id, index) {
    deleteUser(row_id)
      .then((response) => {
        if (response.status === 204) {
          console.log("User has been deleted! Status code:", response.status);
          
        } else {
          //for any other response status other than 201
          console.log(
            "Error! Could not delete user! Status code:",
            response.status
          );
          throw new Error("Error! Could not delete user!");
        }
      })
      .then(() => {
        const updated = characters.filter((character, i) => {
          return i !== index;
        });
        setCharacters(updated);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  }

  function updateList(person) {
    postUser(person)
      //adding another .then here to check response is 201
      .then((response) => {
        if (response.status === 201) {
          //will be able to see console messages on console (developer tools)
          console.log("User has been added! Status code:", response.status);
          return response.json();
        } else {
          //for any other response status other than 201
          console.log(
            "Error! Could not add user! Status code:",
            response.status
          );
          throw new Error("Error! Could not add user!");
        }
      })
      .then((added_user) => {
        setCharacters([...characters, added_user]);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function deleteUser(id) {
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });

    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
