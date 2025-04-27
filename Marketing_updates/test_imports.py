#!/usr/bin/env python
"""Test Azure package imports"""

import sys
import os

print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")
print(f"Python path: {sys.path}")

try:
    import azure.identity
    print("Successfully imported azure.identity")
except ImportError as e:
    print(f"Failed to import azure.identity: {e}")

try:
    import azure.ai.projects
    print("Successfully imported azure.ai.projects")
except ImportError as e:
    print(f"Failed to import azure.ai.projects: {e}")

# Try to determine the virtual environment
venv_path = os.environ.get('VIRTUAL_ENV')
if venv_path:
    print(f"Virtual environment: {venv_path}")
else:
    print("No virtual environment detected")

# Check if we can access site-packages
site_packages = None
for path in sys.path:
    if 'site-packages' in path:
        site_packages = path
        break

if site_packages:
    print(f"Site-packages directory: {site_packages}")
    print("Contents of site-packages:")
    try:
        packages = os.listdir(site_packages)
        azure_packages = [p for p in packages if 'azure' in p.lower()]
        print(f"Azure packages: {azure_packages}")
    except Exception as e:
        print(f"Error listing site-packages: {e}")
else:
    print("No site-packages directory found in sys.path") 