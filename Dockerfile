FROM python:3.11-slim

# Debian depolarını temizleyip tekrar deniyoruz
RUN apt-get clean && apt-get update --fix-missing && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-tur \
    tesseract-ocr-eng \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Ana dizinden backend klasörüne bakıyoruz
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Tüm backend içeriğini kopyala
COPY backend/ .

# FastAPI'yi ayağa kaldır
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]