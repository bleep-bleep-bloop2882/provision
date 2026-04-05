const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');

// GET /api/issues - Fetch issues with optional filtering (status, assignee_id, label)
router.get('/', issueController.getIssues);

// POST /api/issues - Create a new Jira-like task/story/bug
router.post('/', issueController.createIssue);

// PUT /api/issues/:id - Update an existing issue (can trigger workflow state transitions)
router.put('/:id', issueController.updateIssue);

// DELETE /api/issues/:id - Delete an issue
router.delete('/:id', issueController.deleteIssue);

module.exports = router;
