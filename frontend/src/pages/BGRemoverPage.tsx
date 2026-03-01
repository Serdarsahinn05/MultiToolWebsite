import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './BGRemoverPage.module.css';

export default function BGRemoverPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Eğer .env'de URL yoksa, otomatik olarak localhost'a git
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${baseUrl}/api/remove-bg`, formData, {
      responseType: 'blob',
        });
      const imageUrl = URL.createObjectURL(response.data);
      setResultImage(imageUrl);
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

      <h1 className={styles.title}>🪄 AI Background Remover</h1>

      <div className={styles.card}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className={styles.fileInput}
        />

        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className={styles.btn}
        >
          {loading ? "Görsel İşleniyor Lütfen Bekleyin..." : "Arka Planı Temizle"}
        </button>
      </div>

      {(selectedFile || resultImage) && (
        <div className={styles.grid}>
          {selectedFile && (
            <div className={styles.resultBox}>
              <span className={styles.label}>Orijinal Görsel</span>
              <div className={styles.imgWrap}>
                <img src={URL.createObjectURL(selectedFile)} alt="Original" />
              </div>
            </div>
          )}

          {resultImage && (
            <div className={`${styles.resultBox} ${styles.success}`}>
              <span className={styles.label}>Sonuç (Şeffaf PNG)</span>
              <div className={styles.imgWrap}>
                <img src={resultImage} alt="Result" />
              </div>
              <a href={resultImage} download="no-bg.png" className={styles.download}>
                ⬇️ Şeffaf Görseli İndir
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}