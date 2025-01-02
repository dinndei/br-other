// pages/401.tsx
import React from "react";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ color: "red" }}>Unauthorized Access</h1>
      <p style={{ fontSize: "18px" }}>
        You are not authorized to view this page. Please make sure you are logged in.
      </p>
      <Link href="/pages/user/login">
        <a style={{ color: "blue", textDecoration: "underline" }}>Go to Login Page</a>
      </Link>
    </div>
  );
};

export default Unauthorized;
