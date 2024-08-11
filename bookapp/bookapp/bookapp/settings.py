"""
Django settings for bookapp project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_ROOT = '%s/bookstore/static/' % BASE_DIR
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-&(vacd=^x(n&sn*f1!msj=d#k+fnqcll@!tl*xj7(%&-674k4i'

CKEDITOR_UPLOAD_PATH = "images/bookstore/"
import cloudinary

cloudinary.config(
    cloud_name="dluxogrmn",
    api_key="958699327246893",
    api_secret="sL64XQ_2Djr4kg8Gi2vZyR-f5MA",
    # api_proxy="http://proxy.server:3128"
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'books.apps.BooksConfig',
    'oauth2_provider',
    'ckeditor',
    'ckeditor_uploader',
    'rest_framework',
    'drf_yasg',
    'corsheaders',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ORIGIN_ALLOW_ALL = True  # Chac la phai co cai nay thi moi duoc anh huy a

import pymysql

pymysql.install_as_MySQLdb()

ROOT_URLCONF = 'bookapp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'bookapp.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'bookdb2',
        'USER': 'root',
        'PASSWORD': 'Sonhaian123.',
        'PASSWORD': '123456',
        'HOST': ''  # mặc định localhost
    }
}

AUTH_USER_MODEL = 'apps.User'
# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
    )
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'dohuy4547@gmail.com'  # Thay bằng email của bạn
EMAIL_HOST_PASSWORD = 'fmhu gltf mnrn vwrs'  # Thay bằng mật khẩu của bạn


CLIENT_ID = "t9rkxBTnZrPI4eS5ocYZ70Ie35n4mYBhWKWSxWFf"
CLIENT_SECRET = "D9PQ38Usjnh4vheVbzdHQDMPAjB4Q3KD4cRhcSlAb7TCslWAW44H5nUMe1Et1ki91XYz8YSZ5ejPXzdywiDkQINQBIMqeGOgrISbCrBpDNwck6pZdZomlulS2WstCXbv"


GOOGLE_CLIENT_ID="682759047751-s1653sgcgc3jdsce629p7c1uhiglct9f.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"