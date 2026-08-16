import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tabs } from "@/components/ui/Tabs";

describe("shared UI primitives", () => {
  it("renders the structural primitives", () => {
    render(
      <Card>
        <CardContent>
          <Badge>Easy</Badge>
          <Button>Start</Button>
          <ProgressBar value={25} label="Study progress" />
          <EmptyState title="Nothing here yet" />
        </CardContent>
      </Card>,
    );

    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Study progress" })).toHaveAttribute(
      "aria-valuenow",
      "25",
    );
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
  });

  it("exposes a controlled, keyboard-friendly tab list", () => {
    const changes: string[] = [];

    render(
      <Tabs
        items={[
          { id: "overview", label: "Overview" },
          { id: "notes", label: "Notes" },
        ]}
        value="overview"
        onValueChange={(value) => changes.push(value)}
      />,
    );

    const overview = screen.getByRole("tab", { name: "Overview" });
    fireEvent.keyDown(overview, { key: "ArrowRight" });

    expect(changes).toEqual(["notes"]);
  });
});
