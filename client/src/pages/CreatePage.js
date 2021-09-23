import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/CreatePage.css";
import { useHttp } from "../hooks/http.hook";

export const CreatePage = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  const { request } = useHttp();
  const pressHandler = async (event) => {
    if (event.key === "Enter") {
      try {
        const data = await request(
          "/api/link/generate",
          "POST",
          {
            from: link,
          },
          { authorization: `Bearer ${auth.token}` }
        );
        history.push(`/detail/${data.link._id}`);
      } catch (e) {}
    }
  };
  const [link, setLink] = useState();
  return (
    <div className="row">
      <div className="col s8 offset-s2 create_page_div">
        <div className="input-field">
          <input
            placeholder="Enter Link"
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyPress={pressHandler}
          />
          <label htmlFor="email">Enter Link</label>
        </div>
      </div>
    </div>
  );
};
