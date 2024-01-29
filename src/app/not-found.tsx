"use client";

import Error from "next/error";
import type { ClientComponent } from "@/types/next";

const NotFound: ClientComponent = () => (
  <html lang="en">
    <body>
      <Error statusCode={404} />
    </body>
  </html>
);

export default NotFound;
