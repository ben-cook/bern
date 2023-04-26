import React from "react";
import htmlescape from "htmlescape";

interface DocumentProps {
  html: string | TrustedHTML;
  data: any;
}

export const Document = ({ html, data }: DocumentProps) => {
  return (
    <html>
      <head></head>
      <body>
        <div id="__bern" dangerouslySetInnerHTML={{ __html: html }} />
        <script
          dangerouslySetInnerHTML={{
            __html: "__BERN_DATA__ = " + htmlescape(data),
          }}
        />
      </body>
    </html>
  );
};
