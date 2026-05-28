import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import Atlas from "../../components/sections/Atlas";
import messages from "../../messages/en.json";

describe("Atlas", () => {
  it("renders 3 columns with their neighborhoods", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Atlas />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Richmond")).toBeInTheDocument();
    expect(screen.getByText("Vancouver East")).toBeInTheDocument();
    expect(screen.getByText("Vancouver West")).toBeInTheDocument();
    expect(screen.getByText(/Steveston/)).toBeInTheDocument();
    expect(screen.getByText(/Kerrisdale/)).toBeInTheDocument();
    expect(screen.getByText(/Mount Pleasant/)).toBeInTheDocument();
  });
});
