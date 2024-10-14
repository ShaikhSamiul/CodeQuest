#!/bin/bash

# Install all specified dependencies
pip install annotated-types==0.7.0 \
    bcrypt==4.2.0 \
    blinker==1.8.2 \
    cachetools==5.5.0 \
    certifi==2024.8.30 \
    charset-normalizer==3.4.0 \
    click==8.1.7 \
    colorama==0.4.6 \
    Flask==3.0.3 \
    google-ai-generativelanguage==0.6.10 \
    google-api-core==2.21.0 \
    google-api-python-client==2.149.0 \
    google-auth==2.35.0 \
    google-auth-httplib2==0.2.0 \
    google-generativeai==0.8.3 \
    googleapis-common-protos==1.65.0 \
    greenlet==3.1.1 \
    grpcio==1.66.2 \
    grpcio-status==1.66.2 \
    httplib2==0.22.0 \
    idna==3.10 \
    itsdangerous==2.2.0 \
    Jinja2==3.1.4 \
    MarkupSafe==3.0.1 \
    pistonpy==0.0.3 \
    proto-plus==1.24.0 \
    protobuf==5.28.2 \
    pyasn1==0.6.1 \
    pyasn1_modules==0.4.1 \
    PyMySQL==1.1.1 \
    pyparsing==3.2.0 \
    requests==2.32.3 \
    rsa==4.9 \
    SQLAlchemy==2.0.35 \
    tqdm==4.66.5 \
    uritemplate==4.1.1 \
    urllib3==2.2.3 \
    Werkzeug==3.0.4

# Uninstall typing and typing-extensions
pip uninstall -y typing typing-extensions
