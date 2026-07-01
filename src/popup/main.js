import { renderOrders, renderPeices } from "../lib/render.js";
import { slugify } from "../lib/util.js";
import { getItemSet, getTopOrders, getItemIndex } from "../lib/wfm.js";

const search = document.querySelector("#search")
const results = document.querySelector("#results")


async function doSearch(text) {
    if (!text) return;

    const slug = await slugify(text);
    if (!slug) {
        results.textContent = "Invalid Item";
        return;
    }


    let set;
    try {
        set = await getItemSet(slug);
    } catch {
        const index = await getItemIndex();
        const match = Object.entries(index).find(([, item]) => (
            item.name.toLowerCase().includes(text.trim().toLowerCase())
        ));


        if (!match) {
            results.textContent = "No Item Found";
            return;
        }
        set = await getItemSet(match[0])
    }



    const rootPeice = set.find(item => item.setRoot) ?? set[0];

    renderPeices(set, rootPeice.slug)
    await selectPiece(rootPeice.slug)

    // const orders = await getTopOrders(rootPeice.slug);
    // results.textContent = JSON.stringify({ orders, set }, null, 2);
}



export async function selectPiece(itemSlug) {
    const orders = await getTopOrders(itemSlug);
    renderOrders(orders);


    document.querySelectorAll(".piece-btn").forEach(btn => (
        btn.classList.toggle("selected", btn.dataset.slug === itemSlug)
    ));


}





search.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter") {
        doSearch(search.value);
    }
});

document.querySelector("#btn").addEventListener("click", () => doSearch(search.value))



const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
if (tab?.url?.startsWith("https://wiki.warframe.com/w/")) {
    const displayName = new URL(tab.url).pathname.replace("/w/", "").replace(/_/g, " ");
    search.value = displayName;
}


