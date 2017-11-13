describe("Products collection object", function() {
    beforeAll(function() {
        oum.products.setData([]);
        
        spyOn(oui5lib.request, "doRequest");
        spyOn(oum.orders, "onProductLoaded").and.callThrough();
    });

    it ("should load products", function() {
        oum.products.load(["0871132532", "0853455341", "080613125"]);
        expect(oui5lib.request.doRequest.calls.count()).toEqual(1);
        expect(oui5lib.request.doRequest).toHaveBeenCalledWith("product", "getProducts", {"isbns": ["0871132532", "0853455341", "080613125"] }, oum.products.addData);

        oum.products.addData(
            {
                "result": true,
                "value": [
                    {
                        "isbn": "0871132532",
                        "title": {
                            "a": "Lords of poverty :",
                            "b": "the power, prestige, and corruption of the international aid business /",
                            "c": "Graham Hancock."
                        },
                        "author": "Hancock, Graham.",
                        "numbers": {
                            "ISBN": "0871132532 :",
                            "LCCN": "   89006893 "
                        }
                    },
                    {
                        "isbn": "0853455341",
                        "title": {
                            "a": "Conflict and intervention in the Horn of Africa /",
                            "b": "",
                            "c": "Bereket Habte Selassie."
                        },
                        "author": "Bereket H. Selassie.",
                        "numbers": {
                            "ISBN": "0853455341",
                            "LCCN": "   79003868 "
                        }
                    },
                    {
                        "isbn": "080613125",
                        "title": {
                            "a": "The wind won't know me :",
                            "b": "a history of the Navajo-Hopi land dispute /",
                            "c": "Emily Benedek."
                        },
                        "author": "Benedek, Emily.",
                        "numbers": {
                            "ISBN": "080613125X (paper : alk. paper)",
                            "LCCN": "   98043267 "
                        }
                    }
                ]
            }
        );

        expect(oum.orders.onProductLoaded.calls.count()).toEqual(3);
        expect(oum.products.getItemCount()).toEqual(3);
    });

    it ("should return products", function() {
        var data = oum.products.getData(); 
        expect(data.length).toBe(3);
    });
});
