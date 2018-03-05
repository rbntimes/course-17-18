/* eslint-disable semi */

var express = require('express');
var find = require('array-find');
var slug = require('slug');
var bodyParser = require('body-parser');
var multer = require('multer');

var data = require('./questions_txt');

var upload = multer({ dest: 'static/upload/' });
var answers = [];
express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({ extended: true }))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', answered)
  .post('/:id', add)
  .get('/:id', answer)
  .delete('/:id', remove)
  .use(notFound)
  .listen(8000);

function answered(req, res) {
  res.render('list.ejs', { data: answers });
}

console.log(answers);

function answer(req, res, next) {
  var id = req.params.id;

  var question = find(data, function(value) {
    return value.id === Number(id);
  });

  if (!question) {
    next();
    return;
  }

  res.render('detail.ejs', { data: question });
}

function form(req, res) {
  res.render('add.ejs');
}

function add(req, res) {
  console.log(answers, req.url, 'HIER');
  var id = Number(req.url.split('/')[1]);

  answers.push({
    id: id,
    answer: req.body.answer,
    question: data[id - 1].question,
  });

  res.redirect(`/${id + 1}`);
}

function remove(req, res) {
  var id = req.params.id;

  data = data.filter(function(value) {
    return value.id !== id;
  });

  res.json({ status: 'ok' });
}

function notFound(req, res) {
  res.status(404).render('not-found.ejs');
}
