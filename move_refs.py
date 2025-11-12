"""`npm run build` creates html files in dist with the wrong path to the assets. This function corrects that,
while I get my head around moving older versions of the pages into vite."""

import os


def main():
    directory = "vite/dist"
    paths = [f"{directory}/{f}" for f in os.listdir(directory) if f[-4:] == "html"]
    print(paths)
    incorrect = "CRUK_datahub_landing_page/assets"
    correct = "CRUK_datahub_landing_page/vite/dist/assets"
    for path in paths:
        with open(path) as f:
            file = f.read().replace(incorrect, correct)
        with open(path, "w") as f:
            f.write(file)


if __name__ == "__main__":
    main()
