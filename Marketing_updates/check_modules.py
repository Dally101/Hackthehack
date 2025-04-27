#!/usr/bin/env python
"""Check Azure AI Projects modules"""

import pkgutil
import importlib
import sys

# Try to import azure.ai.projects
try:
    import azure.ai.projects
    print("Successfully imported azure.ai.projects")
    
    # Print the package's __file__ to locate it
    print(f"Package located at: {azure.ai.projects.__file__}")
    
    # Try to list all subpackages and modules
    print("\nListing all modules in azure.ai.projects:")
    package = azure.ai.projects
    for importer, modname, ispkg in pkgutil.iter_modules(package.__path__, package.__name__ + '.'):
        print(f"- {modname} ({'package' if ispkg else 'module'})")
        
        # Try to import the module to check its contents
        try:
            module = importlib.import_module(modname)
            if hasattr(module, '__all__'):
                print(f"  - __all__: {module.__all__}")
            else:
                # Try to list some attributes
                attrs = [attr for attr in dir(module) if not attr.startswith('_')][:10]
                if attrs:
                    print(f"  - Some attributes: {attrs}")
        except ImportError as e:
            print(f"  - Error importing: {e}")
    
except ImportError as e:
    print(f"Error importing azure.ai.projects: {e}")

# Check if agents module exists
try:
    print("\nTrying to import azure.ai.projects.agents...")
    import azure.ai.projects.agents
    print("Successfully imported azure.ai.projects.agents")
    
    # Print available classes
    print("Available classes in azure.ai.projects.agents:")
    for name in dir(azure.ai.projects.agents):
        if not name.startswith('_'):
            obj = getattr(azure.ai.projects.agents, name)
            if isinstance(obj, type):  # Check if it's a class
                print(f"- {name}")
except ImportError as e:
    print(f"Error importing azure.ai.projects.agents: {e}")
    
    # Check if the module exists but can't be imported
    if hasattr(azure.ai.projects, 'agents'):
        print("Module 'agents' exists but cannot be imported properly.")

print("\nPython path:")
for path in sys.path:
    print(f"- {path}") 