import "../src/index.tsx";

describe("Block Game", () => {
    const page: HTMLElement = document.body;

    it("Displays the name of the game and new game button.", () => {
        expect(page.textContent).toContain("Block Game");
        expect(page.querySelector("[data-new-game]")).not.toBeNull();
    });
});
