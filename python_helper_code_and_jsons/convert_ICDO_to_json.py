import pandas as pd
import json

def convert_histologies():
    """The histology terms can be downloaded from here https://www.naaccr.org/wp-content/uploads/2020/10/Copy-of-ICD-O-3.2_MFin_17042019_web.xls
    The histologies file is excel and mixes base terms with hierarchical terms. This function separates them
    and converts to a json. For ease it includes two different jsons - one of which has the term 'include all' """

    h = pd.read_excel("histologies.xls")
    h.columns = h.iloc[0, :]
    h = h.iloc[1:, :]

    preferred = h.loc[(h["obs"] != "[obs]") & (h['Level'] == "Preferred")].iloc[:, :3]
    preferred["two"] = preferred["ICDO3.2"].map(lambda x: int(x[:3]))
    two = h.loc[h['Level'].map(lambda x: x == 2)].iloc[:, :3]

    def get_range(x):
        """ x is of form '800' or '874-890'"""
        xlist = x.split("-")
        return range(int(xlist[0]), int(xlist[-1]) + 1)

    two["range"] = two["ICDO3.2"].map(get_range)

    def name(row):
        return row["ICDO3.2"] + " " + row["Term"]

    histologies = {}

    for i in two.index:
        row = two.loc[i]
        key = name(row)
        values = []
        for r in row["range"]:
            preferred_filtered = preferred.loc[preferred["two"] == r]
            values += list(preferred_filtered.apply(name, axis=1))
        histologies[key] = values

    with open("histologies.json", "w") as f:
        json.dump(histologies, f)

    histologies_extra = {"include all": []}

    for i in two.index:
        row = two.loc[i]
        key = name(row)
        values = ["include all"]
        for r in row["range"]:
            preferred_filtered = preferred.loc[preferred["two"] == r]
            values += list(preferred_filtered.apply(name, axis=1))
        histologies_extra[key] = values

    with open("histologies_extra.json", "w") as f:
        json.dump(histologies_extra, f)


def convert_topographies():
    """The topography terms can be downloaded from here https://evs.nci.nih.gov/ftp1/NCI_Thesaurus/Mappings/ICD-O-3_Mappings/ICD-O-3.1-NCIt_Topography_Mapping.txt
    The topographies file is tsv and mixes base terms with two layers of hierarchical terms. This function separates them
    and converts to a json. For ease it includes two different jsons - one of which has the term 'include all' """

    t = pd.read_csv("topographies.tsv", sep='\t')
    t.columns = t.iloc[0, :]
    t = t.iloc[1:, :]
    key_dataframe = t.loc[t["1"] == "2"]
    sub_key_dataframe = t.loc[t["1"] == "3"]
    values_dataframe = t.loc[t["1"] == "4"]

    def in_range(value, the_range):
        """identifies whether value of form C00 is in range C15-C45"""
        a, z = the_range.split("-")
        start = int(a[1:])
        stop = int(z[1:]) + 1
        v = int(value[1:])
        return v in range(start, stop)

    def get_indices(x):
        return [i for i in sub_key_dataframe.index if in_range(sub_key_dataframe.loc[i]["T"], x)]

    name = lambda row: row['T'] + " " + row['TOPOGRAPHY'].capitalize()

    key_dataframe["indices"] = key_dataframe["T"].map(get_indices)
    values_dataframe["name"] = values_dataframe.apply(name, axis=1)
    values_dataframe["sub-key"] = values_dataframe["T"].map(lambda x: x.split(".")[0])

    topographies = {}
    for i in key_dataframe.index:
        row = key_dataframe.loc[i]
        key = name(row)
        indices = row["indices"]
        values = list(sub_key_dataframe.loc[indices].apply(name, axis=1))
        sub_dict = {}
        for value in values:
            code = value.split(" ")[0]
            sub_values = list(values_dataframe.loc[values_dataframe["sub-key"] == code].apply(name, axis=1))
            sub_dict[value] = sub_values
        topographies[key] = sub_dict

    topographies_include_all = {"include_all": dict()}
    for i in key_dataframe.index:
        row = key_dataframe.loc[i]
        key = name(row)
        indices = row["indices"]
        values = list(sub_key_dataframe.loc[indices].apply(name, axis=1))
        sub_dict = {}
        for value in values:
            code = value.split(" ")[0]
            sub_values = ["include_all"] + list(
                values_dataframe.loc[values_dataframe["sub-key"] == code].apply(name, axis=1))
            sub_dict["include_all"] = []
            sub_dict[value] = sub_values
        topographies_include_all[key] = sub_dict

    with open("topographies.json", "w") as f:
        json.dump(topographies, f)

    with open("topographies_include_all.json", "w") as f:
        json.dump(topographies_include_all, f)

