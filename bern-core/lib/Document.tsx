import React from "react";

interface DocumentProps {
  html: string | TrustedHTML;
}

export const Document = ({ html }: DocumentProps) => {
  return (
    <html>
      <head></head>
      <body>
        <div id="__bern" dangerouslySetInnerHTML={{ __html: html }} />
      </body>
    </html>
  );
};
