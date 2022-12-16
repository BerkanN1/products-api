const express = require("express");
const Product = require("../models/Product");
const shortid = require('shortid');
const validurl = require('valid-url');

const config = require('config');

const router = express.Router();

router.get("/", (req, res) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/:id", async (req, res) => {
  try {
    const url = await Product.findOne({ id: req.params.id });
    console.log(url)
    if (url) {
      url.clicks++;
      url.save();
      return res.redirect(url.longUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});



router.post('/shorten', async (req, res) => {

  const { longUrl } = req.body;
  const { tag } = req.body;
  const { deadline } =  req.body;
  //const baseUrl = config.get('baseUrl');
  const baseUrl = config.get('baseUrl');

  if (!validurl.isUri(baseUrl)) {
      return res.status(401).json('Invalid base Url');
  }

  const urlCode = shortid.generate();


      try {
          let url = await Product.findOne({ longUrl })

          if (url) {

              res.json(url);
          } else {

              const shortUrl = baseUrl + '/' + urlCode;
              var time = new Date();
                var result= time.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",hour:"numeric",minute:"numeric",second:"numeric"})

              url = new Product({
                  longUrl,
                  shortUrl,
                  urlCode,
                  date: result,
                  deadline,
                  tag,
                  user:req.userId,

              });

              await url.save();

              res.json(url);
          }

      } catch (err) {
          console.error(err);
          res.status(500).json('Server not found');
      }
    
    
});

router.put("/:id", (req, res) => {
  Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  })
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
