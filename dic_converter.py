class DicConverter:
    """DicConverter does two jobs. Firstly it converters a dictionary of filters into a
    list of dictionaries, which are suitable for uploading into an sql.
     The second task is to also convert the dictionary into a dictionary suitable for using in the
     alternative navbars."""


    classifications = []

    def __init__(self, to_conv, s, category):
        self.to_conv = to_conv
        self.id = s
        self.category = category
        self.dic = self.convert()

    def convert(self):
        if type(self.to_conv) == list:
            i = 0
            dic = dict()
            classification = dict()
            for item in self.to_conv:
                new_id = f"{self.id}_{str(i)}"
                dic[item] = {"id": new_id,
                            "label": item,
                            "category": self.category
                            }
                classification = {"id": new_id,
                                 "label": item,
                                 "category": self.category,
                                 "parent": self.id}
                DicConverter.classifications.append(classification)
                
                i += 1
            return dic
        else:
            i = 0
            dic = dict()
            for key in self.to_conv:
                new_id = f"{self.id}_{str(i)}"
                dic[key] = {"id":new_id,
                            "label": key,
                            "category": self.category,
                            "children": DicConverter(self.to_conv[key], new_id, key).dic
                            }
                classification = {"id": new_id,
                                 "label": key,
                                 "category": self.category,
                                 "parent": self.id,
                                 "child_ids": 
                                  [f"{new_id}_{str(j)}" 
                                   for j in range(len(self.to_conv[key]))]}
                DicConverter.classifications.append(classification)
                i += 1
            return dic
            
        