// index.js
import { JSDOM } from 'jsdom';

const base_url = "https://www.shutterstock.com/id/search/keyword%3a-";
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
};

const getKeywordCount = async (keyword) => {
    const url = `${base_url}${keyword.replace(' ', '+')}`;
    const response = await fetch(url, { headers });

    if (response.status !== 200) {
        console.error(`Error ${response.status}: Could not fetch data for keyword '${keyword}'`);
        return "data tidak ditemukan";
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const title = doc.querySelector("title").textContent;
    const count = title.split(" ")[0];

    if (isNaN(count.replace(".", "").replace(",", ""))) {
        console.error(`Error: Could not extract count for keyword '${keyword}'`);
        return "data tidak ditemukan";
    }

    return parseInt(count.replace(".", "").replace(",", ""), 10);
};

const fetchKeywordCounts = async (keywords) => {
    if (!Array.isArray(keywords) || keywords.length === 0) {
        console.error('Invalid keywords array:', keywords);
        return;
    }

    const keywordCounts = {};

    for (const keyword of keywords) {
        const count = await getKeywordCount(keyword);

        if (count !== null) {
            keywordCounts[keyword] = count;
        }
    }

    const sortedKeywordCounts = Object.entries(keywordCounts).sort((a, b) => a[1] - b[1]);

    const hasil = [];

    for (const [keyword, count] of sortedKeywordCounts) {
        hasil.push({ keyword, count });
    }
    return hasil;
};

async function handleRequest(request) {
    const keywords = await request.json();
    const hasil = await fetchKeywordCounts(keywords);

    return new Response(JSON.stringify({
        message: "Keyword counts fetched successfully!",
        data: hasil
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
