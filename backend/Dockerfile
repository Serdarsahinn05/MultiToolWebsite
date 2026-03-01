FROM python:3.11-slim

# Sistem bağımlılıkları
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-tur \
    tesseract-ocr-eng \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dosyalar artık Dockerfile ile aynı dizinde
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Her şeyi kopyala
COPY . .

# Portu Render standartlarına göre aç
ENV PORT=10000
EXPOSE 10000


# Dosyaların backend/ klasörü içinde olduğunu varsayarsak en garanti yol:
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000", "--log-level", "debug"]