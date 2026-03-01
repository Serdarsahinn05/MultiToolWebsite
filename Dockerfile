FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-tur \
    tesseract-ocr-eng \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Ana dizinden backend klasörüne bakıyoruz.
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Tüm backend içeriğini kopyala.
COPY backend/ .

# Değişken işini Render paneline bırakıyoruz, komutu sadeleştiriyoruz
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]