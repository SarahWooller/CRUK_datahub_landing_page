import os
directory = "docs/assets"
files = [i for i in os.listdir(directory) if i[-3:]==".js"]

changes = [("./sign_in.html", "../sign_in.html"),
          ("./protect_data.html", "../protect_data.html"),
          #("./upload.html", "../upload.html"),
          ("./src/upload.html", "../src/upload.html"),
          ("./about.html", "../about.html"),]

for file in files:
    path = os.path.join(directory, file)
    with open(path) as f:
        text = f.read()
    for old,new in changes:
        text = text.replace(old,new)
    with open(path, "w") as f:
        f.write(text)