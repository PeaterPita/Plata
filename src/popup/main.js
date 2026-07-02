import { renderOrders, renderPieces } from "../lib/render.js";
import { slugify } from "../lib/util.js";
import { getItemSet, getTopOrders, getItemIndex } from "../lib/wfm.js";

const search = document.querySelector("#search")
const results = document.querySelector("#results")


async function doSearch(text) {
    if (!text) return;
    const slug = await resolveSearch(text);

    if (!slug) {
        results.textContent = "Invalid Item";
        return;
    }
    await showPieces(slug);
}

async function resolveSearch(text) {
    const index = await getItemIndex();
    const slug = slugify(text);

    if (index[slug]) return slug;
    if (index[`${slug}_set`]) return `${slug}_set`;

    const match = Object.entries(index).find(([, item]) => (
        item.name.toLowerCase().includes(text.trim().toLowerCase())
    ));

    if (!match) return null;

    console.log("match")
    console.log(match)

    return match[0];
}


async function showPieces(slug) {
    const set = (await getItemSet(slug)).toSorted((a, b) => {
        if (a.setRoot !== b.setRoot) {
            return a.setRoot ? -1 : 1;
        }

        return (a.i18n.en.name).localeCompare(b.i18n.en.name);
    });

    const selected = set.find(item => item.slug === slug)
        ?? set.find(item => item.setRoot)
        ?? set[0];

    search.value = selected.i18n.en.name;
    renderPieces(set, selected.slug, selectPiece);
    await selectPiece(selected.slug);
}



async function selectPiece(itemSlug) {
    const orders = await getTopOrders(itemSlug);
    renderOrders(orders);


    document.querySelectorAll(".piece-btn").forEach(btn => {
        const isSelected = btn.dataset.slug === itemSlug;

        btn.classList.toggle("selected", isSelected)
        if (isSelected) {
            search.value = btn.title;
        }
    });
    await chrome.storage.session.set({ lastSlug: itemSlug });
}


search.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter") {
        doSearch(search.value);
    }
});

document.querySelector("#btn").addEventListener("click", () => doSearch(search.value))

const manifest = chrome.runtime.getManifest();
document.querySelector("#version").textContent = `v${manifest.version}`;
document.querySelector("#homepage").href = manifest.homepage_url;


const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
if (tab?.url?.startsWith("https://wiki.warframe.com/w/")) {
    const displayName = new URL(tab.url).pathname.replace("/w/", "").replace(/[/_]/g, " ");
    search.value = displayName;
} else {
    const { lastSlug } = await chrome.storage.session.get("lastSlug");
    if (lastSlug) {
        showPieces(lastSlug);
    }
}






