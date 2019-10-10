const express = require('express');
const router = express.Router();
const Shorturl = require('../../models/Shorturl');
const request = require('request');


// Send a JSON with error message
const sendInvalidUrlJson = (res) => {
    return res.status(400).json({
        "error": "invalid URL"
    })
}

// Send a JSON with the correct data
const sendRegisterJson = (res, shorturl) => {
    return res.json({
        "original_url": shorturl.url,
        "short_url": shorturl.short
    });
}

// Generate a random shortcut URL
const generateRandomUrlId = async () => {
    do {
        let numberOfDocs = await Shorturl.estimatedDocumentCount();
        let increaseRange = 10;
        let randomUrlId = Math.floor(Math.random() * numberOfDocs * increaseRange);
        let checkIfNumberExists = await Shorturl.findOne({short: randomUrlId});
        if (!checkIfNumberExists) {
            return randomUrlId
        }
    } while (true)
}

// Query a Shorturl Object by the URL
const getShortByURL = async (URL) => {
    const urlshort = await Shorturl.findOne({ url: URL});
    if (!urlshort) {
        return null;
    }
    return urlshort;
}

// Query a Shorturl Object by the ShortId
const getShortByShortId = async (shortId) => {
    const urlshort = await Shorturl.findOne({ short: shortId });
    if (!urlshort) {
        return null
    }
    return urlshort;
}

// Check the req.body
const validateBodyMiddleware = (req, res, next) => {
    if (!req.body.URL) {
        return sendInvalidUrlJson(res);
    }
    if (!req.body.URL.match(/^http(s|):\/\//g)) {
        return sendInvalidUrlJson(res);
    }
    next();
}

// Check if URL is valid (if website is reachable)
const checkConnectMiddleware = (req, response, next) => {
    request(req.body.URL, (err, res, body) => {
        if (err) {
            // console.log(err.message);
            return sendInvalidUrlJson(response);
        } else {
            next();
        }
    })
}

// Check if Shortcut for given URL is already registered
const validateDatabaseMiddlare = async (req, res, next) => {
    const ShortcutAlreadyExists = await getShortByURL(req.body.URL);
    if (ShortcutAlreadyExists) {
        return sendRegisterJson(res, ShortcutAlreadyExists);
    }
    next();
}


// POST for new Shorturl
router.post('/new', validateBodyMiddleware,checkConnectMiddleware, validateDatabaseMiddlare, async (req, res) => {
    try {
        const randomUrlId = await generateRandomUrlId();
        const newShortUrl = await new Shorturl({
            url: req.body.URL,
            short: randomUrlId
        })
        await newShortUrl.save();
        return sendRegisterJson(res, newShortUrl);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            "error": "SERVER ERROR"
        })
    }
});

// GET
// TODO
router.get('/:shorturl', async (req, res) => {
    try {
        const shortobject = await getShortByShortId(req.params.shorturl);
        if (!shortobject) {
            return res.status(400).json({
                "error": "No short url found for given input"
            })
        }   
        return res.redirect(shortobject.url);
    } catch (err) {
        return res.status(500).json({
            "error": "SERVER ERROR"
        })
    }
})


module.exports = router;
