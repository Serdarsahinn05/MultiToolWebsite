from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from services.bg_remover import process_bg_removal
from services.ocr_reader import router as ocr_router
import uvicorn


app = FastAPI()
app.include_router(ocr_router)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Multi-Tool API is Online!"}

# Çok Önemli: React (5173 portu) ve FastAPI (8000 portu) farklı yerlerde olduğu için
# tarayıcı güvenliği (CORS) buna izin vermiyor. Bu middleware ile o engeli kaldırıyoruz.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/remove-bg")
async def remove_background_endpoint(file: UploadFile = File(...)):
    # Frontend'den gelen 'file' paketini oku
    file_bytes = await file.read()

    # servisi çalıştır
    processed_image = process_bg_removal(file_bytes)

    #Response: İşlenmiş resmi PNG formatında ham veri olarak geri fırlat
    return Response(content=processed_image, media_type="image/png")


"""if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
"""