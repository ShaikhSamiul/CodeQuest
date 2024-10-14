#!/bin/bash

# Install all dependencies
pip install -r requirements.txt

# Uninstall typing if it's installed
pip uninstall -y typing typing-extensions