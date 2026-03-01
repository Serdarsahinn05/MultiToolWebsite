from fastapi import APIRouter, File, UploadFile, Form
import pytesseract
from PIL import Image
import os
import io
import platform

router = APIRouter()

# Türkçe Karakter Çözümü
guvenli_temp = os.path.join(os.getcwd(), "ocr_temp")
if not os.path.exists(guvenli_temp):
    os.makedirs(guvenli_temp)

os.environ['TMP'] = guvenli_temp
os.environ['TEMP'] = guvenli_temp
os.environ['TMPDIR'] = guvenli_temp

# --- 2. TESSERACT YOL VE SÖZLÜK ÇÖZÜMÜ ---
# İşletim sistemini kontrol et
if platform.system() == "Windows":
    # Kendi bilgisayarında (Lokal Test)
    pytesseract.pytesseract.tesseract_cmd = r'D:\tesseract\tesseract.exe'
    os.environ['TESSDATA_PREFIX'] = r'D:\tesseract\tessdata'
else:
    # Canlı sunucudasın (Linux)
    # Linux'ta apt-get ile kurulacağı için path belirtmene gerek kalmaz, sistem kendi bulur.
    # TESSDATA_PREFIX de genelde default dizinde (/usr/share/tesseract-ocr/4.00/tessdata/) bulunur.
    pass


@router.post("/api/ocr")
async def extract_text(file: UploadFile = File(...), lang: str = Form("tur")):
    try:
        # Görseli RAM üzerinden (io.BytesIO) okuyoruz
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # Frontend'den gelen 'lang' parametresi (tur, eng, tur+eng) ile OCR işlemi
        ayiklanan_metin = pytesseract.image_to_string(image, lang=lang)

        if ayiklanan_metin.strip() == "":
            return {"text": "Görselde okunabilir bir metin bulunamadı."}

        return {"text": ayiklanan_metin.strip()}

    except Exception as e:
        return {"error": f"Beklenmeyen bir hata oluştu: {str(e)}"}