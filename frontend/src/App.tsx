import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
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
    // FormData: Resimleri JSON ile gönderemeyiz, bu yüzden bir form paketi oluşturuyoruz
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Axios Post: Backend'deki /api/remove-bg adresine paketi gönderiyoruz.
      // ResponseType 'blob' olmalı çünkü Backend bize bir yazı değil, dosya (binary) dönecek.
      const response = await axios.post('http://127.0.0.1:8000/api/remove-bg', formData, {
        responseType: 'blob',
      });

      // Blob to URL: Gelen ham veri yığınını (blob) tarayıcının okuyabileceği bir linke çeviriyoruz.
      const imageUrl = URL.createObjectURL(response.data);
      setResultImage(imageUrl);
    } catch (error) {
      console.error("Hata oluştu:", error);
      alert("Resim işlenirken bir hata meydana geldi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🪄 AI Background Remover</h1>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button onClick={handleUpload} disabled={!selectedFile || loading}>
          {loading ? "İşleniyor..." : "Arka Planı Sil"}
        </button>
      </div>

      <div className="display-section">
        {selectedFile && (
          <div>
            <h3>Orijinal</h3>
            <img src={URL.createObjectURL(selectedFile)} alt="Original" width="300" />
          </div>
        )}

        {resultImage && (
          <div>
            <h3>Sonuç</h3>
            <img src={resultImage} alt="Result" width="300" />
            <br />
            <a href={resultImage} download="no-bg.png">İndir</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;