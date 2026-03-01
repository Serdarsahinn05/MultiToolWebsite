from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from services.bg_remover import process_bg_removal
from services.ocr_reader import router as ocr_router
from rembg import remove, new_session
#import uvicorn


app = FastAPI()
app.include_router(ocr_router)

bg_session = None
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
    global bg_session
    # Eğer session yoksa (ilk istekte), burada oluştur
    if bg_session is None:
        bg_session = new_session("u2net")

    file_bytes = await file.read()
    # Modeli zaten Dockerfile ile indirdiğimiz için burası hızlı çalışacak
    output = remove(file_bytes, session=bg_session)
    return Response(content=output, media_type="image/png")


"""if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
"""