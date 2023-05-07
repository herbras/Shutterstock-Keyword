import { APIRoute } from 'astro';


import { JSDOM } from 'jsdom';

const base_url = "https://www.shutterstock.com/id/search/keyword%3a-";
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
};

const formatNumber = numberString => numberString.replace(".", "").replace(",", "");

const extractTitleFromHtml = html => {
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    return titleMatch ? titleMatch[1] : null;
};

const extractCountFromTitle = title => {
    const count = title.split(" ")[0];
    return !isNaN(formatNumber(count)) ? parseInt(formatNumber(count), 10) : null;
};

const getKeywordCount = async keyword => {
    const url = `${base_url}${keyword.replace(' ', '+')}`;
    try {
        const response = await fetch(url, { headers });

        if (response.status !== 200) {
            console.error(`Error ${response.status}: Could not fetch data for keyword '${keyword}'`);
            return "data tidak ditemukan";
        }

        const html = await response.text();
        const title = extractTitleFromHtml(html);

        if (!title) {
            console.error(`Error: Could not extract count for keyword '${keyword}'`);
            return "data tidak ditemukan";
        }

        const count = extractCountFromTitle(title);

        if (!count) {
            console.error(`Error: Could not extract count for keyword '${keyword}'`);
            return "data tidak ditemukan";
        }

        return count;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return "data tidak ditemukan";
    }
};
};

const fetchKeywordCounts = async keywords => {
    if (!Array.isArray(keywords) || keywords.length === 0) {
        console.error('Invalid keywords array:', keywords);
        return;
    }

    const keywordCounts = await Promise.all(
        keywords.map(async keyword => ({ keyword, count: await getKeywordCount(keyword) }))
    );

    return keywordCounts
        .filter(({ count }) => count !== null)
        .sort((a, b) => a.count - b.count);
};

const handlePreflight = request => new Response(null, {
    headers: {
        "Access-Control-Allow-Origin": "https://penghitung.pages.dev",
        "Access-Control-Allow-Methods": "POST",
"Access-Control-Allow-Headers": "Content-Type",
"Access-Control-Max-Age": "86400",
},
});

async function handleRequest(request) {
if (request.method !== "POST") {
return new Response("Invalid request method", { status: 405 });
}

const keywords = await request.json();

// Memotong array kata kunci menjadi 15 kata kunci teratas
const limitedKeywords = keywords.slice(0, 15);
let hasil;
let warningMessage;

try {
    hasil = await fetchKeywordCounts(limitedKeywords);
} catch (error) {
    console.error("Error:", error.message);
    warningMessage = "Maaf, mohon menunggu selama 1 menit, respon server mengantri.";
}

const response = new Response(JSON.stringify({
    message: hasil ? "Ngambil data sukses!" : "Terjadi kesalahan saat mengambil data.",
    data: hasil,
    warning: warningMessage || (keywords.length > 15 ? "Maaf, untuk sementara request dibatasi hingga 15 kata kunci." : undefined)
}), {
    headers: { "Content-Type": "application/json" },
});

// Set CORS headers
response.headers.set('Access-Control-Allow-Origin', 'https://penghitung.pages.dev');
response.headers.set('Access-Control-Allow-Methods', 'POST');
response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
response.headers.set('Access-Control-Max-Age', '86400');

return response;
}

export const post: APIRoute = async ({ request }) => {
    const keywords = await request.json();
    const hasil = await fetchKeywordCounts(keywords);

    return {
        body: JSON.stringify({
            message: "Keyword counts fetched successfully!",
            data: hasil
        })
    }
};
