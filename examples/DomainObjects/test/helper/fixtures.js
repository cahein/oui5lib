oum.fixture = {};
oum.fixture.startDate = "2017-10-01";
oum.fixture.endDate = "2017-12-01";
oum.fixture.statuses = [ "processing" ];
oum.fixture.orderId = 8;

oum.fixture.ordersData = [
    {
        "id": 1,
        "status": "shipped",
        "orderDate": "2017-05-16 10:01:23",
        "billingAddressId": 1,
        "shippingAddressId": 1,
        "currency": "US-$",
        "items": [
            {
                "productId": "0394718747",
                "quantity": 2,
                "unitPrice": 4.80
            },
            {
                "productId": "0889610356",
                "quantity": 1,
                "unitPrice": 19.90
            }
        ],
        "payments": [
            {
                "date": "2017-05-17",
                "method": "bankpayment",
                "amount": 19.90
            }
        ],
        "shipments": [
            {
                "provider": "CompanyA",
                "shipDate": "2017-05-18"
            }
        ]
    },
    {
        "id": 2,
        "status": "processing",
        "billingAddressId": 2,
        "shippingAddressId": 3,
        "orderDate": "2017-05-02 02:21:03",
        "currency": "€",
        "items": [
            {
                "productId": "1859847390",
                "quantity": 1,
                "unitPrice": 2.40
            },
            {
                "productId": "0889610356",
                "quantity": 2,
                "unitPrice": 19.80
            }
        ],
        "payments": [
            {
                "date": "2017-05-02",
                "method": "creditcard",
                "amount": 2.40
            },
            {
                "date": "2017-05-05",
                "method": "paymentservice",
                "amount": 19.80
            }
        ],
        "shipments": [
            {
                "provider": "CompanyA",
                "shipDate": "2017-05-03"
            },
            {
                "provider": "CompanyB",
                "shipDate": "2017-05-06"
            }
        ]
    }
];

oum.fixture.productsData = [
    {
        "isbn": "0521560241",
        "title": {
            "a": "A forest of time :",
            "b": "American Indian ways of history /",
            "c": "Peter Nabokov."
        },
        "author": "Nabokov, Peter.",
        "edition": "",
        "published": "New York : Cambridge University Press, 2002.",
        "note": "",
        "bibliography": "Includes bibliographical references and index.",
        "numbers": {
            "ISBN": "0521560241 (hardback)",
            "LCCN": "  2001025955"
        },
        "salesPrice": 105.00,
        "stockQty": 1
    },
    {
        "isbn": "0394718747",
        "title": {
            "a": "Propaganda: the formation of men's attitudes.",
            "b": "",
            "c": "Translated from the French by Konrad Kellen and Jean Lerner. With an introd. by Konrad Kellen."
        },
        "author": "Ellul, Jacques.",
        "edition": "",
        "published": "New York, Vintage Books [1973, c1965]",
        "note": "",
        "bibliography": "Bibliography: p. [315]-320.",
        "numbers": {
            "ISBN": "0394718747",
            "LCCN": "   72008053 "
        },
        "salesPrice": 13.09,
        "stockQty": 8
    },
    {
        "isbn": "0889610356",
        "title": {
            "a": "Population target :",
            "b": "the political economy of population control in Latin America /",
            "c": "by Bonnie Mass."
        },
        "author": "Mass, Bonnie.",
        "edition": "",
        "published": "[Toronto : Latin American Working Group, c1976]",
        "note": "",
        "bibliography": "Includes bibliographical references and indexes.",
        "numbers": {
            "ISBN": "0889610356.",
            "LCCN": "   77372439 "
        },
        "salesPrice": 15.76,
        "stockQty": 2
    },
    {
        "isbn": "1859847390",
        "title": {
            "a": "Late Victorian holocausts :",
            "b": "El Niño famines and the making of the third world /",
            "c": "Mike Davis."
        },
        "author": "Davis, Mike, 1946-",
        "edition": "",
        "published": "London ; New York : Verso, 2001.",
        "note": "",
        "bibliography": "Includes bibliographical references and index.",
        "numbers": {
            "ISBN": "1859847390 (cloth)",
            "LCCN": "   00054989 "
        },
        "salesPrice": 5.60,
        "stockQty": 28
    }
];

oum.fixture.addressesData = [
    {
        "id": 1,
        "firstname": "Donald",
        "lastname": "Knuth",
        "street": "Algo Str. 1",
        "city": "Mathtown 0",
        "postcode": "123"
    },
    {
        "id": 2,
        "firstname": "Edward",
        "lastname": "Snowden",
        "street": "Uliza Nonsa",
        "city": "Moscow",
        "postcode": "001"
    },
    {
        "id": 3,
        "firstname": "No Privacy",
        "lastname": "Here",
        "street": "Mac Goo Str. 10",
        "city": "Fakebook",
        "postcode": "-1"
    }
];
