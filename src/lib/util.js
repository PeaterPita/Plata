export async function slugify(text) {
    return text.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "_");
}
