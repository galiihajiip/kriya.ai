import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyA04psV-26TvZv0qPFbLMdxCJYfTF4SdIU";
const genAI = new GoogleGenerativeAI(API_KEY);

// CORRECT MODELS yang TERSEDIA di Gemini API (2025):
// - gemini-2.5-flash: untuk text + vision (multimodal, cepat)
// - gemini-2.5-pro: untuk text + vision (multimodal, paling powerful)
// Note: Model lama (gemini-pro, gemini-1.5-pro) sudah RETIRED April 2025

// Model untuk text generation - gunakan gemini-2.5-flash (cepat & efisien)
const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Model untuk vision (image analysis) - gunakan gemini-2.5-flash (multimodal)
const visionModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Fallback model jika flash overloaded
const visionModelPro = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
const textModelPro = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

/**
 * Helper function untuk retry dengan exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastRetry = i === maxRetries - 1;
      const isOverloaded = error.message?.includes('overloaded') || error.message?.includes('503');

      if (isLastRetry || !isOverloaded) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, i);
      console.log(`⏳ [RETRY ${i + 1}/${maxRetries}] Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Helper function untuk convert file ke base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Menganalisis gambar motif dan memberikan klasifikasi
 * REAL GEMINI API CALL - NO MOCK DATA
 */
export async function analyzeMotifImage(imageFile) {
  console.log("🤖 [REAL AI] Starting Gemini Vision API analysis...");

  try {
    // Validate input
    if (!imageFile) {
      throw new Error("No image file provided");
    }

    let imageParts;
    let mimeType = 'image/jpeg';
    let fileName = imageFile.name || 'unknown';

    console.log("📷 [REAL AI] Processing file:", fileName, "Type:", imageFile.type);

    // Convert file to base64
    const base64 = await fileToBase64(imageFile);
    const base64Data = base64.split(',')[1];

    if (!base64Data) {
      throw new Error("Failed to convert image to base64");
    }

    mimeType = imageFile.type || 'image/jpeg';

    imageParts = [{
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    }];

    console.log("🚀 [REAL AI] Sending request to Gemini 2.5 Flash (Vision)...");
    console.log("📊 [REAL AI] Image size:", base64Data.length, "bytes");

    // REAL PROMPT untuk analisis yang akurat
    const prompt = `Analisis gambar ini secara DETAIL dan AKURAT. Jika ini adalah kain tradisional Indonesia (batik, tenun, songket, dll), berikan informasi lengkap. Jika bukan kain tradisional, jelaskan apa yang terlihat.

Berikan response dalam format JSON yang VALID (tanpa markdown, tanpa backticks):

{
  "nama_motif": "Nama spesifik motif/kain yang terdeteksi, atau 'Unknown' jika tidak dapat diidentifikasi",
  "daerah_asal": "Provinsi/daerah asal yang SPESIFIK (contoh: Yogyakarta, Sumba Timur NTT, Palembang), atau 'Tidak Teridentifikasi'",
  "warna_dominan": ["warna1", "warna2", "warna3"],
  "filosofi": "Penjelasan makna dan filosofi motif jika diketahui, atau deskripsi visual jika tidak",
  "jenis_produk": "Jenis produk (Batik Tulis, Tenun Ikat, Songket, Kain, dll)",
  "kategori": "Kategori motif (Geometris, Flora, Fauna, Parang, Kawung, dll)",
  "confidence": 85,
  "deskripsi": "Deskripsi DETAIL tentang apa yang terlihat dalam gambar, teknik pembuatan, dan karakteristik khas",
  "is_traditional_fabric": true
}

PENTING:
- Berikan confidence score yang REALISTIS (rendah jika tidak yakin)
- Jika bukan kain tradisional, set is_traditional_fabric: false
- Jika tidak dapat mengidentifikasi, tulis "Unknown" atau "Tidak Teridentifikasi"
- Berikan response HANYA JSON, tanpa teks lain`;

    let result, response, text;

    // Try dengan retry dan fallback ke Pro model jika Flash overloaded
    try {
      // CALL GEMINI API dengan retry
      result = await retryWithBackoff(async () => {
        return await visionModel.generateContent([prompt, ...imageParts]);
      });
      response = await result.response;
      text = response.text();
      console.log("✅ [REAL AI] Success with gemini-2.5-flash");
    } catch (flashError) {
      // Jika Flash gagal, fallback ke Pro
      console.warn("⚠️ [FALLBACK] gemini-2.5-flash failed, trying gemini-2.5-pro...");
      console.warn("Flash error:", flashError.message);

      result = await retryWithBackoff(async () => {
        return await visionModelPro.generateContent([prompt, ...imageParts]);
      });
      response = await result.response;
      text = response.text();
      console.log("✅ [REAL AI] Success with gemini-2.5-pro (fallback)");
    }

    console.log("✅ [REAL AI] Received response from Gemini API");
    console.log("📝 [REAL AI] Response preview:", text.substring(0, 300));

    // Clean up response - remove markdown code blocks if any
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '');
    cleanedText = cleanedText.replace(/```\n?/g, '');
    cleanedText = cleanedText.trim();

    // Try to extract JSON
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("❌ [REAL AI] No JSON found in response");
      console.error("Full response:", text);
      throw new Error("No valid JSON in Gemini response");
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log("✅ [REAL AI] Successfully parsed Gemini response");
      console.log("🎯 [REAL AI] Detected:", parsed.nama_motif, "from", parsed.daerah_asal);
      console.log("📊 [REAL AI] Confidence:", parsed.confidence + "%");

      // Validate dan normalize data
      const result = {
        nama_motif: parsed.nama_motif || "Motif Tidak Teridentifikasi",
        daerah_asal: parsed.daerah_asal || "Tidak Teridentifikasi",
        warna_dominan: Array.isArray(parsed.warna_dominan) ? parsed.warna_dominan : [],
        filosofi: parsed.filosofi || "Informasi filosofi tidak tersedia.",
        jenis_produk: parsed.jenis_produk || "Kain",
        kategori: parsed.kategori || "Tidak Teridentifikasi",
        confidence: parseInt(parsed.confidence) || 50,
        deskripsi: parsed.deskripsi || "Analisis detail tidak tersedia.",
        is_traditional_fabric: parsed.is_traditional_fabric !== false
      };

      return result;

    } catch (parseError) {
      console.error("❌ [REAL AI] JSON parsing error:", parseError);
      console.error("Attempted to parse:", jsonMatch[0]);
      throw new Error("Failed to parse Gemini JSON response");
    }

  } catch (error) {
    console.error("❌ [REAL AI] Gemini API Error:", error.message);
    console.error("Error details:", error);

    // Re-throw error - TIDAK LANGSUNG FALLBACK KE MOCK
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}

/**
 * Generate narasi budaya berdasarkan nama motif
 * REAL GEMINI API CALL
 */
export async function generateCulturalNarrative(motifName, daerahAsal) {
  console.log("📚 [REAL AI] Generating cultural narrative for:", motifName);

  try {
    const prompt = `Tuliskan narasi budaya yang AKURAT dan edukatif tentang "${motifName}" dari ${daerahAsal}.

Ceritakan secara DETAIL tentang:
1. Sejarah dan asal-usul motif ini secara spesifik
2. Makna filosofis dan simbolisme yang AKURAT
3. Proses pembuatan tradisional yang sebenarnya
4. Peran dalam upacara adat atau kehidupan sehari-hari
5. Cerita rakyat atau legenda yang terkait (jika ada)

Tulis dalam bahasa Indonesia yang menarik, sekitar 4-5 paragraf, cocok untuk edukasi.
Gunakan informasi yang FAKTUAL dan AKURAT. Jika tidak yakin tentang sesuatu, katakan bahwa informasi tersebut bervariasi atau perlu dikonfirmasi.`;

    let result, response, narrative;

    try {
      result = await retryWithBackoff(async () => {
        return await textModel.generateContent(prompt);
      });
      response = await result.response;
      narrative = response.text();
      console.log("✅ [REAL AI] Narrative generated with gemini-2.5-flash, length:", narrative.length);
    } catch (flashError) {
      console.warn("⚠️ [FALLBACK] Trying gemini-2.5-pro for narrative generation...");
      result = await retryWithBackoff(async () => {
        return await textModelPro.generateContent(prompt);
      });
      response = await result.response;
      narrative = response.text();
      console.log("✅ [REAL AI] Narrative generated with gemini-2.5-pro (fallback), length:", narrative.length);
    }

    return narrative;

  } catch (error) {
    console.error("❌ [REAL AI] Error generating narrative:", error);
    throw error;
  }
}

/**
 * Cari motif yang mirip berdasarkan deskripsi
 * REAL GEMINI API CALL
 */
export async function searchSimilarMotifs(description) {
  console.log("🔍 [REAL AI] Searching similar motifs for:", description);

  try {
    const prompt = `Berdasarkan deskripsi: "${description}", berikan 3 rekomendasi motif kain tradisional Indonesia yang BENAR-BENAR mirip atau cocok.

Berikan informasi yang AKURAT dan FAKTUAL tentang motif-motif yang ada di Indonesia.

Format response dalam JSON array (HANYA JSON, tanpa teks lain):
[
  {
    "nama_motif": "nama motif yang REAL",
    "daerah_asal": "daerah asal yang SPESIFIK",
    "similarity_reason": "alasan kenapa mirip/cocok secara FAKTUAL",
    "characteristics": "karakteristik khas yang AKURAT"
  }
]`;

    let result, response, text;

    try {
      result = await retryWithBackoff(async () => {
        return await textModel.generateContent(prompt);
      });
      response = await result.response;
      text = response.text();
    } catch (flashError) {
      console.warn("⚠️ [FALLBACK] Trying gemini-2.5-pro for similar motifs...");
      result = await retryWithBackoff(async () => {
        return await textModelPro.generateContent(prompt);
      });
      response = await result.response;
      text = response.text();
    }

    // Clean up response
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '');
    cleanedText = cleanedText.replace(/```\n?/g, '');
    cleanedText = cleanedText.trim();

    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log("✅ [REAL AI] Found", parsed.length, "similar motifs");
      return parsed;
    }

    return [];
  } catch (error) {
    console.error("❌ [REAL AI] Error searching motifs:", error);
    return [];
  }
}

/**
 * Generate auto-description untuk produk yang diupload
 * REAL GEMINI API CALL
 */
export async function generateProductDescription(productData) {
  console.log("📝 [REAL AI] Generating product description");

  try {
    const { nama_motif, daerah_asal, jenis_produk, warna_dominan } = productData;

    const prompt = `Buatkan deskripsi produk e-commerce yang MENARIK dan PERSUASIF untuk:
- Motif: ${nama_motif}
- Daerah Asal: ${daerah_asal}
- Jenis Produk: ${jenis_produk}
- Warna Dominan: ${warna_dominan?.join(', ') || 'Beragam'}

Deskripsi harus:
1. Menarik dan persuasif untuk calon pembeli
2. Menyebutkan keunikan budaya secara SPESIFIK
3. Menjelaskan kualitas dan teknik kerajinan yang AKURAT
4. Professional dan informatif
5. Panjang sekitar 3-4 paragraf
6. Menggunakan bahasa Indonesia yang baik dan benar

Fokus pada FAKTA dan KEUNIKAN produk ini secara spesifik.`;

    let result, response, description;

    try {
      result = await retryWithBackoff(async () => {
        return await textModel.generateContent(prompt);
      });
      response = await result.response;
      description = response.text();
      console.log("✅ [REAL AI] Description generated with gemini-2.5-flash, length:", description.length);
    } catch (flashError) {
      console.warn("⚠️ [FALLBACK] Trying gemini-2.5-pro for product description...");
      result = await retryWithBackoff(async () => {
        return await textModelPro.generateContent(prompt);
      });
      response = await result.response;
      description = response.text();
      console.log("✅ [REAL AI] Description generated with gemini-2.5-pro (fallback), length:", description.length);
    }

    return description;

  } catch (error) {
    console.error("❌ [REAL AI] Error generating description:", error);
    throw error;
  }
}

/**
 * Generate quiz questions untuk edukasi
 * REAL GEMINI API CALL
 */
export async function generateQuizQuestions(motifName) {
  console.log("❓ [REAL AI] Generating quiz for:", motifName);

  try {
    const prompt = `Buatkan 5 pertanyaan quiz interaktif yang AKURAT dan FAKTUAL tentang motif "${motifName}" untuk edukasi.

Pertanyaan harus berdasarkan FAKTA yang benar tentang motif ini.

Format response dalam JSON array (HANYA JSON, tanpa teks lain):
[
  {
    "question": "pertanyaan yang FAKTUAL",
    "options": ["opsi A", "opsi B", "opsi C", "opsi D"],
    "correct_answer": 0,
    "explanation": "penjelasan jawaban yang AKURAT"
  }
]`;

    let result, response, text;

    try {
      result = await retryWithBackoff(async () => {
        return await textModel.generateContent(prompt);
      });
      response = await result.response;
      text = response.text();
    } catch (flashError) {
      console.warn("⚠️ [FALLBACK] Trying gemini-2.5-pro for quiz generation...");
      result = await retryWithBackoff(async () => {
        return await textModelPro.generateContent(prompt);
      });
      response = await result.response;
      text = response.text();
    }

    // Clean up response
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '');
    cleanedText = cleanedText.replace(/```\n?/g, '');
    cleanedText = cleanedText.trim();

    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log("✅ [REAL AI] Generated", parsed.length, "quiz questions");
      return parsed;
    }

    return [];
  } catch (error) {
    console.error("❌ [REAL AI] Error generating quiz:", error);
    return [];
  }
}
