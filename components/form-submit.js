"use client";
// function for delay form submit and change button to text
import { useFormStatus } from "react-dom";
export default function FormSubmit() {
  const status = useFormStatus();

  if (status.pending) {
    return <p>Creating post...</p>;
  }

  return (
    <>
      <button type="reset">Reset</button>
      <button>Create Post</button>
    </>
  );
}
