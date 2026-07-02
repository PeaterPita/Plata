const API_BASE = "https://api.warframe.market/v2";
const ITEM_INDEX_TTL = 1000 * 3600 * 24;


async function refreshItemIndex() {
    let res = await fetch(`${API_BASE}/items`);
    const { data } = await res.json();

    const index = Object.fromEntries(data.map(item => (
        [item.slug, { "name": item.i18n.en.name, "icon": item.i18n.en.icon }]
    )));

    await chrome.storage.local.set({ itemIndex: index, itemIndexDate: Date.now() });
    return index;
}



export async function getItemIndex() {
    const { itemIndex, itemIndexDate } = await chrome.storage.local.get(["itemIndex", "itemIndexDate"]);

    const isStale = !itemIndex || !itemIndexDate || Date.now() - itemIndexDate > ITEM_INDEX_TTL;
    return isStale ? refreshItemIndex() : itemIndex;
}



export async function getItemSet(slug) {
    const key = `set:${slug}`
    const cached = (await chrome.storage.session.get(key))[key];

    if (cached && Date.now() - cached.date < 1000 * 3600 * 24) {
        return cached.data;
    }

    let res = await fetch(`${API_BASE}/item/${slug}/set`);
    let { data, error } = await res.json();


    if (error) {
        res = await fetch(`${API_BASE}/item/${slug}_set/set`);
        ({ data, error } = await res.json());
    }

    if (error) {
        throw new Error(error.request?.[0] ?? "unknown warframe.market error");
    }

    const items = data.items;
    const set = Object.fromEntries(
        items.map(item => (
            [`set:${item.slug}`, {
                data: items, date: Date.now()
            }]
        ))
    );

    await chrome.storage.session.set(set);
    return items;
}



export async function getTopOrders(slug) {
    const key = `orders:${slug}`;

    const cached = (await chrome.storage.session.get(key))[key];
    if (cached && Date.now() - cached.date < 1000 * 60 * 3) {
        return cached.data;
    }

    let res = await fetch(`${API_BASE}/orders/item/${slug}/top`);
    const { data, error } = await res.json();

    if (error) {
        throw new Error(error.request?.[0] ?? "unknown warframe.market error");
    }

    await chrome.storage.session.set({ [key]: { data, date: Date.now() } });
    return data;
}





