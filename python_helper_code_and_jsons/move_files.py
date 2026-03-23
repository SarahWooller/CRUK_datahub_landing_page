import os
import shutil
import subprocess

if "docs" not in os.listdir():
    os.mkdir("docs")

publics = ['crh.png','poster.png','scientist.png']
docs_files = os.listdir("docs")
for file in publics:
    if file not in docs_files:
        new_path = os.path.join("docs", file)
        shutil.copy(os.path.join("public", file), new_path)
        
