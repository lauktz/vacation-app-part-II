import os
from datetime import timedelta

# JWT Configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'your_super_secret_key_here_change_in_production')
JWT_EXPIRATION_TIME = int(os.environ.get('JWT_EXPIRATION_TIME', 3600))  # 1 hour in seconds

# Flask Configuration
FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
FLASK_DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'

# JWT Token expiration as timedelta
JWT_EXPIRATION_DELTA = timedelta(seconds=JWT_EXPIRATION_TIME)

