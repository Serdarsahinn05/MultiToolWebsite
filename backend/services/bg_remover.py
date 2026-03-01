from rembg import remove
from PIL import Image
import io


def process_bg_removal(input_bytes: bytes) -> bytes:
    """
    Gelen görsel verisinin arka planını siler ve PNG byte verisi olarak döner.
    """
    try:
        # 1. Byte verisini Pillow Image objesine çevir
        input_image = Image.open(io.BytesIO(input_bytes))

        # 2. Arka planı sil
        output_image = remove(input_image)

        # 3. Sonucu RAM'de (BytesIO) bir sanal dosyaya kaydet
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG')

        # 4. Byte değerini geri döndür
        return img_byte_arr.getvalue()

    except Exception as e:
        # Hata durumunda loglama yapılabilir veya hata fırlatılabilir
        print(f"BG Remover Error: {e}")
        raise e

