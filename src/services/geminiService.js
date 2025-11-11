import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyA04psV-26TvZv0qPFbLMdxCJYfTF4SdIU";
const genAI = new GoogleGenerativeAI(API_KEY);

// Model untuk text generation
const textModel = genAI.getGenerativeModel({ model: "gemini-pro" });

// Model untuk vision (image analysis)
const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Menganalisis gambar motif dan memberikan klasifikasi
 * @param {File|string} imageFile - File gambar atau base64 string
 * @returns {Promise<Object>} - Hasil analisis motif
 */
export async function analyzeMotifImage(imageFile) {
  try {
    let imageParts;

    if (typeof imageFile === 'string') {
      // Jika sudah base64 string
      imageParts = [{
        inlineData: {
          data: imageFile.split(',')[1],
          mimeType: 'image/jpeg'
        }
      }];
    } else {
      // Jika File object
      const base64 = await fileToBase64(imageFile);
      imageParts = [{
        inlineData: {
          data: base64.split(',')[1],
          mimeType: imageFile.type
        }
      }];
    }

    const prompt = `Analisis gambar kain tradisional Indonesia ini dan berikan informasi berikut dalam format JSON:
    {
      "nama_motif": "nama motif atau jenis kain",
      "daerah_asal": "provinsi atau daerah asal",
      "warna_dominan": ["warna1", "warna2", "warna3"],
      "filosofi": "penjelasan filosofi dan makna motif (2-3 kalimat)",
      "jenis_produk": "jenis produk (sarung, selendang, kain, dll)",
      "kategori": "kategori motif (geometris, flora, fauna, abstrak, dll)",
      "confidence": "tingkat kepercayaan analisis (0-100)",
      "deskripsi": "deskripsi detail tentang motif dan karakteristiknya"
    }

    Berikan response dalam format JSON yang valid.`;

    const result = await visionModel.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Parse JSON dari response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Format response tidak valid");
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}

/**
 * Generate narasi budaya berdasarkan nama motif
 * @param {string} motifName - Nama motif
 * @param {string} daerahAsal - Daerah asal motif
 * @returns {Promise<string>} - Narasi budaya
 */
export async function generateCulturalNarrative(motifName, daerahAsal) {
  try {
    const prompt = `Tuliskan narasi budaya yang menarik dan edukatif tentang motif "${motifName}" dari ${daerahAsal}.
    Ceritakan tentang:
    1. Sejarah dan asal-usul motif
    2. Makna filosofis dan simbolisme
    3. Proses pembuatan tradisional
    4. Peran dalam upacara adat atau kehidupan sehari-hari
    5. Cerita rakyat atau legenda yang terkait

    Tulis dalam bahasa Indonesia yang menarik, sekitar 3-4 paragraf, cocok untuk edukasi anak muda.`;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating narrative:", error);
    throw error;
  }
}

/**
 * Cari motif yang mirip berdasarkan deskripsi
 * @param {string} description - Deskripsi motif yang dicari
 * @returns {Promise<Array>} - Saran motif yang mirip
 */
export async function searchSimilarMotifs(description) {
  try {
    const prompt = `Berdasarkan deskripsi: "${description}", berikan 5 rekomendasi motif kain tradisional Indonesia yang mungkin cocok.

    Format response dalam JSON array:
    [
      {
        "nama_motif": "nama motif",
        "daerah_asal": "daerah",
        "similarity_reason": "alasan kenapa mirip/cocok",
        "characteristics": "karakteristik khas"
      }
    ]`;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON dari response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error("Error searching motifs:", error);
    throw error;
  }
}

/**
 * Generate auto-description untuk produk yang diupload
 * @param {Object} productData - Data produk
 * @returns {Promise<string>} - Deskripsi auto-generated
 */
export async function generateProductDescription(productData) {
  try {
    const { nama_motif, daerah_asal, jenis_produk, warna_dominan } = productData;

    const prompt = `Buatkan deskripsi produk yang menarik untuk e-commerce dari informasi berikut:
    - Motif: ${nama_motif}
    - Daerah Asal: ${daerah_asal}
    - Jenis Produk: ${jenis_produk}
    - Warna Dominan: ${warna_dominan?.join(', ')}

    Deskripsi harus:
    1. Menarik dan persuasif untuk pembeli
    2. Menyebutkan keunikan budaya
    3. Menjelaskan kualitas dan kerajinan
    4. Panjang sekitar 2-3 paragraf
    5. Menggunakan bahasa Indonesia yang baik`;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating description:", error);
    throw error;
  }
}

/**
 * Generate quiz questions untuk edukasi
 * @param {string} motifName - Nama motif
 * @returns {Promise<Array>} - Array quiz questions
 */
export async function generateQuizQuestions(motifName) {
  try {
    const prompt = `Buatkan 5 pertanyaan quiz interaktif tentang motif "${motifName}" untuk edukasi anak muda.

    Format JSON:
    [
      {
        "question": "pertanyaan",
        "options": ["opsi A", "opsi B", "opsi C", "opsi D"],
        "correct_answer": 0,
        "explanation": "penjelasan jawaban"
      }
    ]`;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}

// Helper function
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
