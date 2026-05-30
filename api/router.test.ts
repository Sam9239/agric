import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./router";

function createCaller(adminAuthenticated = false) {
  return appRouter.createCaller({
    req: new Request("http://localhost/api/trpc"),
    resHeaders: new Headers(),
    adminAuthenticated,
  });
}

describe("appRouter", () => {
  it("responds to ping", async () => {
    const result = await createCaller().ping();

    expect(result.ok).toBe(true);
    expect(typeof result.ts).toBe("number");
  });

  it("serves demo products without a database", async () => {
    const products = await createCaller().product.list();

    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("category");
  });

  it("blocks admin product changes without an admin session", async () => {
    await expect(
      createCaller().product.create({
        name: "Test Product",
        category: "seeds",
        shortDescription: "Short description",
        description: "Long description",
        imageUrl: "/images/products/certified-maize-seed.png",
        featured: false,
      }),
    ).rejects.toBeInstanceOf(TRPCError);
  });
});
