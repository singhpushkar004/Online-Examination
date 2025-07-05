import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

const AdminMessageList = () => {
  const [messages, setMessages] = useState([]);
  const [editReplyId, setEditReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filterText, setFilterText] = useState('');

  const fetchMessages = async () => {
    const res = await fetch('http://localhost:5000/api/messages');
    const data = await res.json();
    setMessages(data);
  };

  const handleReplySave = async (id) => {
    await fetch(`http://localhost:5000/api/messages/${id}/reply`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: replyText }),
    });
    setEditReplyId(null);
    setReplyText('');
    fetchMessages();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'DELETE',
      });
      fetchMessages();
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages by name, email, or message content
  const filteredMessages = messages.filter((msg) => {
    return (
      msg.name.toLowerCase().includes(filterText.toLowerCase()) ||
      msg.email.toLowerCase().includes(filterText.toLowerCase()) ||
      msg.message.toLowerCase().includes(filterText.toLowerCase()) ||
      (msg.reply && msg.reply.toLowerCase().includes(filterText.toLowerCase()))
    );
  });

  const columns = [
    {
      name: 'S No.',
      selector: (row, index) => index + 1,
      width: '70px',
      sortable: false,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Message',
      selector: (row) => row.message,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Reply',
      cell: (row) =>
        editReplyId === row._id ? (
          <Form.Control
            as="textarea"
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        ) : (
          row.reply || 'No reply yet'
        ),
      sortable: false,
      wrap: true,
      grow: 2,
    },
    {
      name: 'Actions',
      cell: (row) =>
        editReplyId === row._id ? (
          <Button
            size="sm"
            variant="success"
            onClick={() => handleReplySave(row._id)}
          >
            Save
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setEditReplyId(row._id);
                setReplyText(row.reply || '');
              }}
              className="me-2"
            >
              {row.reply ? 'Edit Reply' : 'Reply'}
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(row._id)}
            >
              <i className="fa fa-trash"></i>
            </Button>
          </>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '180px',
    },
  ];

  return (
    <Container className="mt-4">
      <h2>Contact Messages</h2>

      {/* Search input */}
      <Form.Control
        type="text"
        placeholder="Search by name, email, message, or reply"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ maxWidth: '400px', marginBottom: '10px' }}
      />

      <DataTable
        columns={columns}
        data={filteredMessages}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
        noHeader
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 20]}
        dense
      />
    </Container>
  );
};

export default AdminMessageList;
