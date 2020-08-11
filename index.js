const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex');
	const {
		body: { content },
		params: { id },
	} = req;

	const comments = commentsByPostId[id] || [];
	comments.push({ id: commentId, content, status: 'pending' });

	commentsByPostId[id] = comments;

	await axios.post('http://localhost:4005/events', {
		type: 'CommentCreated',
		data: {
			postId: id,
			id: commentId,
			content,
			status: 'pending',
		},
	});

	res.status(201).send(comments);
});

app.post('/events', (req, res) => {
	console.log(`Received Event: ${req.body.type}`);

	res.send({});
});

app.listen(4001, () => {
	console.log('Listening on port 4001');
});
