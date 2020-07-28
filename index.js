const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
	const commentId = randomBytes(4).toString('hex');
	const {
		body: { content },
		params: { id },
	} = req;

	const comments = commentsByPostId[id] || [];
	comments.push({ id: commentId, content });

	commentsByPostId[id] = comments;

	res.status(201).send(comments);
});

app.listen(4001, () => {
	console.log('Listening on port 4001');
});
