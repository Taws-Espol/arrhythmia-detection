# config.py
import os


class Config:
    DEBUG = True  # Set to False in production
    TESTING = True
    SECRET_KEY = os.environ.get("SECRET_KEY")
    TF_ENABLE_ONEDNN_OPTS = 0
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_PERMANENT = True
    SESSION_TYPE = "filesystem"
    SESSION_USE_SIGNER = True
    PERMANENT_SESSION_LIFETIME = 2592000  # Set session lifetime (30 days in seconds)

    # Add other configuration settings as needed
    LOGGING_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOGGING_LOCATION = "logs/app.log"
    LOGGING_LEVEL = "INFO"

    # Configuration for Swagger UI
    RESTX_SWAGGER_UI_DOC_EXPANSION = "list"

    if not os.path.exists("logs"):
        os.makedirs("logs")
