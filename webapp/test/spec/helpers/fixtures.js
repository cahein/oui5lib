oui5lib.fixtures = {};
oui5lib.fixtures.paramDefs = [
    {
        "name": "userId",
        "required": true,
        "type": "string",
        "validate": [
            "required"
        ]
    },
    {
        "name": "persNr",
        "required": true,
        "type": "string",
        "validate": [
            "required",
            "numbersOnly",
            "length_8"
        ]
    },
    {
        "name": "name",
        "required": true,
        "type": "string",
        "validate": [
            "required",
            "hasLetters"
        ]
    },
    {
        "name": "email",
        "required": false,
        "type": "email",
        "validate": [
            "email"
        ]
    },
    {
        "name": "emailActive",
        "required": false,
        "type": "boolean",
        "default": false
    },
    {
        "name": "sms",
        "required": false,
        "type": "phone",
        "validate": [
            "phone"
        ]
    },
    {
        "name": "smsActive",
        "type": "boolean",
        "default": false
    },
    {
        "name": "role",
        "required": true,
        "type": "string",
        "default": "user",
        "allowedValues": ["user", "administrator"]
    },
    {
        "name": "roles",
        "required": true,
        "type": "array",
        "allowedValues": ["user", "administrator"]
    },
    {
        "name": "other",
        "required": true,
        "type": "array",
        "arrayItem": [
            {
                "name": "a",
                "required": true,
                "type": "string",
                "validate": [
                    "required"
                ]
            },
            {
                "name": "b",
                "required": false,
                "type": "string"
            }
        ]
    },
    {
        "name": "permissions",
        "required": true,
        "type": "object",
        "objectItem": [
            {
                "name": "saveUser",
                "required": false,
                "type": "boolean",
                "default": false
            }
        ]
    }
];
