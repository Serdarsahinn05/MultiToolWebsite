import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './OCRReaderPage.module.css';

export default function OCRReaderPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("tur"); // Varsayılan: Türkçe
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setExtractedText(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('lang', language); // Backend'e seçilen dili de yolluyoruz!

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/ocr', formData);
      setExtractedText(response.data.text || "Metin bulunamadı.");
    } catch (error) {
      console.error("Hata oluştu:", error);
      alert("Python Backend'e bağlanılamadı. Uvicorn çalışıyor mu?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.backBtn}>
        ← Geri Dön
      </button>

      <h1 className={styles.title}>📄 AI OCR Text Reader</h1>

      <div className={styles.card}>
        {/* Görsel Yükleme */}
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className={styles.fileInput}
        />

        {/* Dil Seçimi */}
        <div className={styles.selectGroup}>
          <label className={styles.selectLabel}>
            Belge Dili
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={styles.selectBox}
          >
            <option value="tur">🇹🇷 Türkçe</option>
            <option value="eng">🇬🇧 İngilizce</option>
            <option value="tur+eng">🌍 Türkçe + İngilizce</option>
          </select>
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className={styles.btn}
        >
          {loading ? "Metin Çıkarılıyor..." : "Metni Oku"}
        </button>
      </div>

      {(selectedFile || extractedText) && (
        <div className={styles.grid}>
          {selectedFile && (
            <div className={styles.resultBox}>
              <span className={styles.label}>Yüklenen Görsel</span>
              <div className={styles.imgWrap}>
                <img src={URL.createObjectURL(selectedFile)} alt="Original" />
              </div>
            </div>
          )}

          {extractedText && (
            <div className={`${styles.resultBox} ${styles.success}`}>
              <span className={styles.label}>Çıkarılan Metin</span>
              <div
                className="bg-[#04040c] text-teal-400 p-5 rounded-xl border border-teal-500/30 font-mono text-sm whitespace-pre-wrap overflow-y-auto"
                style={{ maxHeight: '400px' }}
              >
                {extractedText}
              </div>

              <button
                onClick={() => navigator.clipboard.writeText(extractedText)}
                className={styles.download}
              >
                📋 Metni Kopyala
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}