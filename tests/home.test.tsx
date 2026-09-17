import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import HomePage from "../app/page";

afterEach(cleanup);

describe("Balkan Rehberim başlangıç ekranı", () => {
  it("başlığı ve pilotun dört sınırını gösterir", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Balkanlar için");
    const pilot = screen.getByRole("region", { name: "Bu pilot kimler için?" });
    for (const text of ["Arnavutluk + Karadağ", "4–6 gün", "Çift · 2 kişi", "Kiralık araç"]) {
      expect(within(pilot).getByText(text)).toBeDefined();
    }
  });

  it("başlama çağrısını mevcut pilot bölümüne bağlar ve akışın henüz açık olmadığını bildirir", () => {
    render(<HomePage />);

    const cta = screen.getByRole("link", { name: "Plan oluşturmaya başla" });
    const target = cta.getAttribute("href");
    expect(target).toBe("#pilot-kapsami");
    expect(document.querySelector(target!)).toBe(screen.getByRole("region", { name: "Bu pilot kimler için?" }));
    const description = document.getElementById(cta.getAttribute("aria-describedby")!);
    expect(description?.textContent).toContain("Planlama akışı henüz açık değil.");
    expect(document.querySelector("form")).toBeNull();
  });
});
