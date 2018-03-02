/* todo sækja pakka sem vantar  */
const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://hugrungudmundsdottir:hugrun94@localhost/gagnagrunnur';

/**
 * Create a note asynchronously.
 *
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create({ title, text, datetime } = {}) {
  /* todo útfæra */

  const client = new Client({ connectionString });

  await client.connect();

  try {
    const boi = 'INSERT INTO notes(title, text, datetime) VALUES($1,$2,$3) RETURNING *';
    const values = [title, text, datetime];
    const result = await client.query(boi, values);


    const { rows } = result;
    return rows;

  } catch (err) {
      console.error('Error running query');
      throw err;
  } finally {
    console.log('end')
    await client.end();
  }
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {

  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query('SELECT * FROM notes');

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function readOne(id) {
  /* todo útfæra */

  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query('SELECT * FROM notes WHERE id=($1)',[id]);

    const { rows } = result;
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function update(id, { title, text, datetime } = {}) {
  /* todo útfæra */

  const client = new Client({ connectionString });

  await client.connect();

  try {
    const boi = 'UPDATE notes SET title = ($1), text = ($2), datetime = ($3) WHERE id = ($4) RETURNING *';
    const result = await client.query(boi, [title, text, datetime, id]);


    const { rows } = result;
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  /* todo útfæra */

  const client = new Client({ connectionString });

  await client.connect();

  try {
    const values = [id];
    const result = await client.query('DELETE FROM notes WHERE id = $1 RETURNING *',values);

    if (result.rowCount === 1) {
      return true;
    }
    return false;

  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
