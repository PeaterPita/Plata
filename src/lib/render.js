
const results = document.querySelector("#results")


export function renderPeices(set, selectedSlug, onSelect) {
    document.querySelector("#pieces")?.remove();

    const pieces = document.createElement("div");
    pieces.id = "pieces";

    for (const item of set) {
        const btn = document.createElement("button");
        btn.className = "piece-btn" + (item.slug === selectedSlug ? " selected" : "");
        btn.dataset.slug = item.slug;
        btn.title = item.i18n.en.name;




        const img = document.createElement("img");
        img.src = item.i18n.en.subIcon
            ? `https://warframe.market/static/assets/${item.i18n.en.subIcon}`
            : `https://warframe.market/static/assets/${item.i18n.en.icon}`;

        img.alt = item.i18n.en.name;
        btn.appendChild(img);
        btn.addEventListener("click", () => onSelect(item.slug))
        pieces.appendChild(btn);
    }
    results.prepend(pieces);
}


export function renderOrders(orders) {
    document.querySelector("#orders")?.remove();

    const table = document.createElement("table");
    table.id = "orders";


    const header = table.insertRow();
    header.insertCell().textContent = "Sell";
    header.insertCell().textContent = "Buy";

    const rowCount = Math.max(orders.buy.length, orders.sell.length);

    for (let i = 0; i < rowCount; i++) {
        const row = table.insertRow();

        const buyOrder = orders.buy[i];
        const sellOrder = orders.sell[i];

        row.insertCell().textContent = sellOrder ? `${sellOrder.platinum}` : "";
        row.insertCell().textContent = buyOrder ? `${buyOrder.platinum}` : "";
    }

    results.appendChild(table);
}
