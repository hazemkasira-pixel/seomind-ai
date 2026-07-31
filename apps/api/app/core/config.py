from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "SEOMind AI"
    APP_VERSION: str = "0.1.0"

    # تم تغيير الاسم هنا لتجاوز الملف المقفل وإنشاء قاعدة بيانات جديدة نظيفة
    DATABASE_URL: str = "sqlite:///./seomind_v2.db"

    JWT_SECRET: str = "CHANGE_ME_IN_PRODUCTION"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # --- إعدادات الذكاء الاصطناعي (Qwen) ---
    QWEN_API_KEY: str = ""

    # --- إعدادات الاتصال بووردبريس ---
    WORDPRESS_URL: str = ""
    WORDPRESS_USER: str = ""
    WORDPRESS_APP_PASSWORD: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )

settings = Settings()