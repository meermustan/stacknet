import React from "react";
import Template from "../components/Template";
import { useParams } from "react-router-dom";

export default function Discussions(props) {

  const a = useParams();

  const title = a.category;
  const arr = title.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const str2 = arr.join(" ");
  return (
    <Template sectionName={str2} buttonTitle="Start a discussion" />
  );
}
