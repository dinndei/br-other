// pages/_error.tsx
import { NextPageContext } from "next";

function Error({ statusCode }: { statusCode: number }) {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>שגיאה {statusCode}</h1>
            <p>
                {statusCode === 404
                    ? "הדף שחיפשת לא נמצא"
                    : "אירעה שגיאה בשרת"}
            </p>
            <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
                חזרה לדף הבית
            </a>
        </div>
    );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
    return { statusCode };
};

export default Error;
