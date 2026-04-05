const db = require('../db');

// Valid status transitions
const WORKFLOW_VALIDATIONS = {
  'To Do': ['In Progress', 'Canceled'],
  'In Progress': ['To Do', 'In Review', 'Done', 'Canceled'],
  'In Review': ['In Progress', 'Done', 'Canceled'],
  'Done': ['In Progress'],
  'Canceled': ['To Do']
};

/**
 * 1. Create a new issue (Task, Story, Bug, Epic)
 */
exports.createIssue = async (req, res) => {
  const { project_id, title, description, type, priority, reporter_id, assignee_id, story_points } = req.body;

  try {
    // Generate an issue key (e.g., ENG-104) based on project
    const projectRes = await db.query('SELECT key FROM projects WHERE id = $1', [project_id]);
    if (projectRes.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    
    const projectKey = projectRes.rows[0].key;

    // Get absolute sequence count for the project's issues to generate KEY
    const countRes = await db.query('SELECT COUNT(*) FROM issues WHERE project_id = $1', [project_id]);
    const nextNum = parseInt(countRes.rows[0].count, 10) + 1;
    const key = `${projectKey}-${nextNum}`;

    const insertQuery = `
      INSERT INTO issues (project_id, key, title, description, type, priority, reporter_id, assignee_id, story_points)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    
    const values = [project_id, key, title, description, type || 'Task', priority || 'Medium', reporter_id, assignee_id, story_points];
    const newIssue = await db.query(insertQuery, values);

    res.status(201).json(newIssue.rows[0]);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 2. Get issues with filtering
 */
exports.getIssues = async (req, res) => {
  const { status, assignee_id, type, project_id, label } = req.query;

  let query = `
    SELECT i.*, 
      u1.name as assignee_name, 
      u2.name as reporter_name
    FROM issues i
    LEFT JOIN users u1 ON i.assignee_id = u1.id
    LEFT JOIN users u2 ON i.reporter_id = u2.id
  `;
  const conditions = [];
  const values = [];

  if (status) { conditions.push(`i.status = $${values.push(status)}`); }
  if (assignee_id) { conditions.push(`i.assignee_id = $${values.push(assignee_id)}`); }
  if (type) { conditions.push(`i.type = $${values.push(type)}`); }
  if (project_id) { conditions.push(`i.project_id = $${values.push(project_id)}`); }
  
  if (label) {
    query += ` INNER JOIN issue_labels l ON i.id = l.issue_id`;
    conditions.push(`l.label = $${values.push(label)}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }
  
  query += ` ORDER BY i.created_at DESC`;

  try {
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 3. Update an issue (including workflow transitions)
 */
exports.updateIssue = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    // Basic validation & Transition logic
    if (updates.status) {
      const currentRes = await db.query('SELECT status FROM issues WHERE id = $1', [id]);
      if (currentRes.rows.length === 0) return res.status(404).json({ error: 'Issue not found' });
      
      const currentStatus = currentRes.rows[0].status;
      const allowedTransitions = WORKFLOW_VALIDATIONS[currentStatus];
      
      if (!allowedTransitions.includes(updates.status)) {
        return res.status(400).json({ 
          error: `Invalid transition! Cannot move issue from '${currentStatus}' to '${updates.status}'` 
        });
      }
    }

    // Dynamic update query builder
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      setClause.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
    
    setClause.push(`updated_at = CURRENT_TIMESTAMP`);

    const updateQuery = `
      UPDATE issues 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING *;
    `;
    values.push(id);

    const updatedIssue = await db.query(updateQuery, values);
    if (updatedIssue.rows.length === 0) return res.status(404).json({ error: 'Issue not found' });

    res.json(updatedIssue.rows[0]);
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 4. Delete an issue
 */
exports.deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM issues WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Issue not found' });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
