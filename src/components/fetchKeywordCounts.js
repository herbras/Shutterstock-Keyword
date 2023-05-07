import { get } from 'svelte/store';
import { keywordsInput, result, loading, errorMessage } from "./store";

export const fetchKeywordCounts = async () => {
  result.set(null);
  errorMessage.set(null);

  const keywords = get(keywordsInput).split(",").map((keyword) => keyword.trim());
  if (keywords.length > 15) {
    errorMessage.set("Maaf, untuk sementara request dibatasi hingga 15 kata kunci.");
    return;
  }

  loading.set(true);

  try {
    const response = await fetch(<YOUR API URL>, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keywords),
    });

    if (response.ok) {
      const data = await response.json();
      result.set(data.data);
    } else if (response.status === 503) {
      errorMessage.set("Maaf mohon menunggu selama 1 menit, respon server mengantri.");
    } else {
      console.error(`Error: ${response.statusText}`);
      errorMessage.set("Terjadi kesalahan saat mengambil data. Mohon tunggu 1-2 menit dan coba lagi.");
    }
  } catch (error) {
    console.error("Fetch error:", error.message);
    errorMessage.set("Terjadi kesalahan saat mengambil data. Mohon tunggu 1-2 menit dan coba lagi.");
  } finally {
    loading.set(false);
  }
};
